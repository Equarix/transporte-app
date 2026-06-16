import { Injectable } from '@nestjs/common';
import { CreateSaleDtoService } from './dto/create-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale, SaleFrom, StatusSale } from './entities/sale.entity';
import { DataSource, Repository } from 'typeorm';
import { SaleDetail } from './entities/sale_detail.entity';
import { HotelDetail } from './entities/hotel_detail.entity';
import {
  PointsFrom,
  PointsUser,
  TypePointsMovement,
} from '../points-user/entities/points-user.entity';
import { SalePayer } from './entities/sale_payer.entity';
import { parse } from 'date-fns';
import { PromosService } from '../promos/promos.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetail)
    private saleDetailRepository: Repository<SaleDetail>,
    @InjectRepository(HotelDetail)
    private hotelDetailRepository: Repository<HotelDetail>,
    @InjectRepository(PointsUser)
    private pointsUserRepository: Repository<PointsUser>,
    @InjectRepository(SalePayer)
    private salePayerRepository: Repository<SalePayer>,

    private dataSource: DataSource,
    private promosService: PromosService,
  ) {}

  async create(createSaleDto: CreateSaleDtoService) {
    const {
      userId,
      reserverId,
      payer,
      paymentMethod,
      hotel,
      passengers,
      fromDestinationId,
      toDestinationId,
      busId,
      promoCode,
    } = createSaleDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      let responseSale: Sale | null = null;
      const saveSalePayer = await queryRunner.manager.save(SalePayer, {
        userId,
        documentType: payer.documentType,
        documentNumber: payer.documentNumber,
        names: payer.names + ' ' + payer.lastName,
        email: payer.email,
        phone: payer.phone,
        providerMethod: paymentMethod.provider,
        typeMethod: paymentMethod.type,
      });

      const saveSale = await queryRunner.manager.save(Sale, {
        userId,
        purchaseFrom: SaleFrom.WEB,
        reserverId,
        salePayer: saveSalePayer,
        fromDestinationId: fromDestinationId as number,
        toDestinationId: toDestinationId as number,
      });

      responseSale = saveSale;

      if (hotel) {
        const { hotelId, price_per_night, checkIn, checkOut, name } = hotel;

        const saveHotelDetail = await queryRunner.manager.save(HotelDetail, {
          hotelId,
          amount: price_per_night,
          sale: saveSale,
          checkIn: parse(checkIn as string, 'yyyy-MM-dd', new Date()),
          checkOut: parse(checkOut as string, 'yyyy-MM-dd', new Date()),
          clientName: payer.names + ' ' + payer.lastName,
          hotelName: name,
          referenceNumber: 'REF-' + Math.random().toString(36).substring(2, 15),
          roomId: Math.floor(Math.random() * 1000) + 1,
        });

        responseSale = {
          ...saveSale,
          hotelDetails: [saveHotelDetail],
        };
      }

      const saveSaleDetails = await Promise.all(
        passengers.map((passenger) => {
          const {
            seatId,
            floor,
            row,
            column,
            price,
            documentNumber,
            documentType,
          } = passenger;

          const saveSaleDetail = queryRunner.manager.save(SaleDetail, {
            busId: busId as number,
            seatId,
            floor,
            row,
            column,
            amount: price,
            documentNumber,
            documentType,
            name: passenger.name,
            typeSeat: passenger.typeSeat,
            sale: saveSale,
          });
          return saveSaleDetail;
        }),
      );

      responseSale = {
        ...responseSale,
        saleDetails: saveSaleDetails,
      };

      const pointUsers = await Promise.all(
        passengers.map((passenger) => {
          const points = Math.floor(passenger.price / 10);
          const savePointsUser = queryRunner.manager.save(PointsUser, {
            userId,
            points,
            pointsFrom: PointsFrom.SALE,
            type: TypePointsMovement.ADDITION,
            sale: saveSale,
          });
          return savePointsUser;
        }),
      );

      responseSale = {
        ...responseSale,
        pointsUsers: pointUsers,
      };

      if (promoCode) {
        const subtotal = passengers.reduce((sum, p) => sum + p.price, 0);
        await this.promosService.redeem({
          code: promoCode,
          saleId: saveSale.saleId,
          userId,
          purchaseAmount: subtotal,
        });
      }

      await queryRunner.commitTransaction();
      return responseSale;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getSalesReport() {
    const kpis = await this.saleDetailRepository.createQueryBuilder('detail')
      .select('SUM(detail.amount)', 'totalRevenue')
      .addSelect('COUNT(detail.saleDetailId)', 'ticketsSold')
      .getRawOne();
      
    const salesCount = await this.saleRepository.count();
    const ticketsSold = parseInt(kpis?.ticketsSold || '0', 10);
    const totalRevenue = parseInt(kpis?.totalRevenue || '0', 10);
    
    // Calculate dynamic occupancy: tickets sold / (sales/trips * average capacity of 50)
    const occupancyRate = salesCount > 0 ? Math.min(Math.round((ticketsSold / (salesCount * 50)) * 100), 100) : 0;
    
    // Group monthly trends
    const trendsRaw = await this.saleRepository.createQueryBuilder('sale')
      .select('YEAR(sale.createdAt)', 'year')
      .addSelect('MONTH(sale.createdAt)', 'month')
      .addSelect('sale.purchaseFrom', 'purchaseFrom')
      .addSelect('SUM(detail.amount)', 'total')
      .innerJoin('sale.saleDetails', 'detail')
      .groupBy('YEAR(sale.createdAt), MONTH(sale.createdAt), sale.purchaseFrom')
      .orderBy('YEAR(sale.createdAt)', 'ASC')
      .addOrderBy('MONTH(sale.createdAt)', 'ASC')
      .getRawMany();

    // Map trends to a friendly output format
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const trendsMap: Record<string, { month: string; direct: number; agencies: number }> = {};

    for (const raw of trendsRaw) {
      const year = raw.year;
      const monthIdx = parseInt(raw.month, 10) - 1;
      const label = `${monthNames[monthIdx]} ${year}`;
      
      if (!trendsMap[label]) {
        trendsMap[label] = { month: label, direct: 0, agencies: 0 };
      }
      
      const val = parseInt(raw.total || '0', 10);
      if (raw.purchaseFrom === 'WEB') {
        trendsMap[label].direct += val;
      } else {
        trendsMap[label].agencies += val;
      }
    }

    const trends = Object.values(trendsMap);

    // Get recent transactions
    const recentSales = await this.saleRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
      relations: {
        saleDetails: true,
        salePayer: true,
      }
    });

    // Calculate real monthly growth rate comparing this month vs last month
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthRes = await this.saleDetailRepository.createQueryBuilder('detail')
      .select('SUM(detail.amount)', 'total')
      .innerJoin('detail.sale', 'sale')
      .where('sale.createdAt >= :start', { start: startOfThisMonth })
      .getRawOne();

    const lastMonthRes = await this.saleDetailRepository.createQueryBuilder('detail')
      .select('SUM(detail.amount)', 'total')
      .innerJoin('detail.sale', 'sale')
      .where('sale.createdAt >= :start AND sale.createdAt <= :end', { start: startOfLastMonth, end: endOfLastMonth })
      .getRawOne();

    const thisMonthTotal = parseFloat(thisMonthRes?.total || '0');
    const lastMonthTotal = parseFloat(lastMonthRes?.total || '0');

    let growthRate = 0;
    if (lastMonthTotal > 0) {
      growthRate = Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 * 10) / 10;
    }

    return {
      totalRevenue,
      ticketsSold,
      growthRate,
      occupancyRate,
      trends,
      recentSales,
    };
  }

  findAll() {
    return this.saleRepository.find({
      relations: {
        saleDetails: true,
        salePayer: true,
      }
    });
  }

  findOne(id: number) {
    return this.saleRepository.findOne({
      where: { saleId: id },
      relations: {
        saleDetails: true,
        salePayer: true,
      }
    });
  }

  remove(id: number) {
    return this.saleRepository.delete(id);
  }

  async getSalesAgentReport() {
    // 1. Fetch approved sales with ticket count and revenue grouped by agencyId
    const approvedSales = await this.saleRepository.find({
      where: { status: StatusSale.APPROVED },
      relations: {
        saleDetails: true,
      },
    });

    // We can group sales in-memory to keep it simple, clean, and robust
    const agencyMetricsMap: Record<number, { ticketsSold: number; totalSales: number; conversionCount: number; totalCount: number }> = {};

    for (const sale of approvedSales) {
      if (!sale.agencyId) continue;
      if (!agencyMetricsMap[sale.agencyId]) {
        agencyMetricsMap[sale.agencyId] = { ticketsSold: 0, totalSales: 0, conversionCount: 0, totalCount: 0 };
      }
      
      const tickets = sale.saleDetails?.length || 0;
      const salesVal = (sale.saleDetails || []).reduce((sum, det) => sum + (det.amount || 0), 0);
      
      agencyMetricsMap[sale.agencyId].ticketsSold += tickets;
      agencyMetricsMap[sale.agencyId].totalSales += salesVal;
      agencyMetricsMap[sale.agencyId].conversionCount += 1; // approved counts as converted
    }

    // Also count total (approved + pending + cancelled) sales per agency to calculate conversion rate
    const allSales = await this.saleRepository.find({
      where: { purchaseFrom: SaleFrom.TAQUILLA }
    });

    for (const sale of allSales) {
      if (!sale.agencyId) continue;
      if (!agencyMetricsMap[sale.agencyId]) {
        agencyMetricsMap[sale.agencyId] = { ticketsSold: 0, totalSales: 0, conversionCount: 0, totalCount: 0 };
      }
      agencyMetricsMap[sale.agencyId].totalCount += 1;
    }

    const agencyMetrics = Object.entries(agencyMetricsMap).map(([agencyId, metrics]) => {
      const convRate = metrics.totalCount > 0 
        ? Math.round((metrics.conversionCount / metrics.totalCount) * 1000) / 10
        : 70.0; // default conversion fallback

      return {
        agencyId: parseInt(agencyId, 10),
        ticketsSold: metrics.ticketsSold,
        totalSales: metrics.totalSales,
        conversionRate: convRate,
      };
    });

    return {
      agencyMetrics,
    };
  }

  async getAgencyReport() {
    const approvedSales = await this.saleRepository.find({
      where: { status: StatusSale.APPROVED },
      relations: {
        saleDetails: true,
      },
    });

    const metricsMap: Record<number, { ticketsSold: number; totalSales: number; conversionCount: number; totalCount: number }> = {};

    for (const sale of approvedSales) {
      if (!sale.agencyId) continue;
      if (!metricsMap[sale.agencyId]) {
        metricsMap[sale.agencyId] = { ticketsSold: 0, totalSales: 0, conversionCount: 0, totalCount: 0 };
      }
      const tickets = sale.saleDetails?.length || 0;
      const salesVal = (sale.saleDetails || []).reduce((sum, det) => sum + (det.amount || 0), 0);
      
      metricsMap[sale.agencyId].ticketsSold += tickets;
      metricsMap[sale.agencyId].totalSales += salesVal;
      metricsMap[sale.agencyId].conversionCount += 1;
    }

    const allSales = await this.saleRepository.find({
      where: { purchaseFrom: SaleFrom.TAQUILLA }
    });

    for (const sale of allSales) {
      if (!sale.agencyId) continue;
      if (!metricsMap[sale.agencyId]) {
        metricsMap[sale.agencyId] = { ticketsSold: 0, totalSales: 0, conversionCount: 0, totalCount: 0 };
      }
      metricsMap[sale.agencyId].totalCount += 1;
    }

    const agencyMetrics = Object.entries(metricsMap).map(([agencyId, metrics]) => {
      const convRate = metrics.totalCount > 0 
        ? Math.round((metrics.conversionCount / metrics.totalCount) * 100)
        : 70;

      return {
        agencyId: parseInt(agencyId, 10),
        ticketsSold: metrics.ticketsSold,
        totalSales: metrics.totalSales,
        conversionRate: convRate,
      };
    });

    return {
      agencyMetrics,
    };
  }

  async getRoutesReport() {
    const approvedSales = await this.saleRepository.find({
      where: { status: StatusSale.APPROVED },
      relations: {
        saleDetails: true,
      },
    });

    const routeMetricsMap: Record<string, {
      fromDestinationId: number;
      toDestinationId: number;
      ticketsSold: number;
      revenue: number;
      salesCount: number;
    }> = {};

    for (const sale of approvedSales) {
      if (sale.fromDestinationId === null || sale.fromDestinationId === undefined || sale.toDestinationId === null || sale.toDestinationId === undefined) continue;
      const key = `${sale.fromDestinationId}-${sale.toDestinationId}`;
      if (!routeMetricsMap[key]) {
        routeMetricsMap[key] = {
          fromDestinationId: sale.fromDestinationId,
          toDestinationId: sale.toDestinationId,
          ticketsSold: 0,
          revenue: 0,
          salesCount: 0,
        };
      }
      
      const tickets = sale.saleDetails?.length || 0;
      const amount = (sale.saleDetails || []).reduce((sum, det) => sum + (det.amount || 0), 0);
      
      routeMetricsMap[key].ticketsSold += tickets;
      routeMetricsMap[key].revenue += amount;
      routeMetricsMap[key].salesCount += 1;
    }

    const routeMetrics = Object.values(routeMetricsMap).map((m) => {
      const loadFactor = m.salesCount > 0 
        ? Math.min(Math.round((m.ticketsSold / (m.salesCount * 50)) * 100), 100)
        : 0;

      return {
        fromDestinationId: m.fromDestinationId,
        toDestinationId: m.toDestinationId,
        ticketsSold: m.ticketsSold,
        revenue: m.revenue,
        loadFactor,
      };
    });

    return {
      routeMetrics,
    };
  }

  async findUserSales(userId: number) {
    return this.saleRepository.find({
      where: { userId },
      relations: {
        saleDetails: true,
        salePayer: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
