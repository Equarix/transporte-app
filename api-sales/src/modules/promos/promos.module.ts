import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromosService } from './promos.service';
import { PromosController } from './promos.controller';
import { Promo } from './entities/promo.entity';
import { PromoRedemption } from './entities/promo-redemption.entity';
import { PointsUser } from '../points-user/entities/points-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promo, PromoRedemption, PointsUser])],
  controllers: [PromosController],
  providers: [PromosService],
  exports: [PromosService],
})
export class PromosModule {}
