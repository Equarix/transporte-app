import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsUserService } from './points-user.service';
import { PointsUserController } from './points-user.controller';
import { PointsUser } from './entities/points-user.entity';
import { Promo } from '../promos/entities/promo.entity';
import { PromoRedemption } from '../promos/entities/promo-redemption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PointsUser, Promo, PromoRedemption])],
  controllers: [PointsUserController],
  providers: [PointsUserService],
})
export class PointsUserModule {}
