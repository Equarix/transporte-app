import { Injectable } from '@nestjs/common';
import { CreateSaleDtoService } from './dto/create-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale, SaleFrom } from './entities/sale.entity';
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

      await queryRunner.commitTransaction();
      return responseSale;
    } catch {
      await queryRunner.rollbackTransaction();
      return 'Error al crear la venta';
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
