import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromosService } from './promos.service';
import { PromosController } from './promos.controller';
import { Promo } from './entities/promo.entity';
import { PromoRedemption } from './entities/promo-redemption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promo, PromoRedemption])],
  controllers: [PromosController],
  providers: [PromosService],
  exports: [PromosService],
})
export class PromosModule {}
