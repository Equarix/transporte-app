import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleDetail } from './entities/sale_detail.entity';
import { HotelDetail } from './entities/hotel_detail.entity';
import { PointsUser } from '../points-user/entities/points-user.entity';
import { SalePayer } from './entities/sale_payer.entity';
import { PromosModule } from '../promos/promos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      SaleDetail,
      HotelDetail,
      PointsUser,
      SalePayer,
    ]),
    PromosModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
