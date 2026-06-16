import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Destination } from '../destination/entities/destination.entity';
import { Bus } from '../bus/entities/bus.entity';
import { Profile } from '../user/entities/profile.entity';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientProxy,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getSalesReport() {
    // 1. Fetch raw report from the sales microservice
    const reportData = await firstValueFrom(
      this.paymentClient.send('getSalesReport', {}),
    );

    if (!reportData) {
      return null;
    }

    // 2. Fetch gateway database collections to resolve names (avoiding N+1 queries)
    const destinations = await this.destinationRepository.find();
    const destMap = new Map(destinations.map((d) => [d.destinationId, d]));

    const profiles = await this.profileRepository.find();
    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    const buses = await this.busRepository.find();
    const busMap = new Map(buses.map((b) => [b.busId, b]));

    // 3. Map/enrich recent transactions with human-readable information
    const enrichedRecentSales = (reportData.recentSales || []).map((sale: any) => {
      const origin = destMap.get(sale.fromDestinationId)?.name || 'Origen';
      const dest = destMap.get(sale.toDestinationId)?.name || 'Destino';
      
      // Get the customer name from the profile relation or salePayer
      let customerName = sale.salePayer?.names || 'Cliente';
      if (sale.userId) {
        const profile = profileMap.get(sale.userId);
        if (profile) {
          customerName = `${profile.firstName} ${profile.lastName}`;
        }
      }

      // Determine class or model from the bus
      let busClass = 'Ejecutivo';
      if (sale.saleDetails && sale.saleDetails.length > 0) {
        const detailBusId = sale.saleDetails[0].busId;
        const bus = busMap.get(detailBusId);
        if (bus) {
          busClass = bus.type || bus.model || 'Ejecutivo';
        }
      }

      // Total amount for this transaction (sum of its saleDetails amounts)
      const totalAmount = (sale.saleDetails || []).reduce(
        (sum: number, det: any) => sum + (det.amount || 0),
        0,
      );

      return {
        saleId: sale.saleId,
        bookingId: `#IT-${String(sale.saleId).padStart(5, '0')}`,
        route: `${origin} → ${dest}`,
        busClass,
        customer: customerName,
        status: sale.status,
        date: sale.createdAt,
        amount: totalAmount,
      };
    });

    return {
      totalRevenue: reportData.totalRevenue,
      ticketsSold: reportData.ticketsSold,
      growthRate: reportData.growthRate,
      occupancyRate: reportData.occupancyRate,
      trends: reportData.trends,
      recentSales: enrichedRecentSales,
    };
  }
}
