import { Module } from '@nestjs/common';
import { PublicAgencyService } from './public-agency.service';
import { PublicAgencyController } from './public-agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from 'src/modules/agency/entities/agency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency])],
  controllers: [PublicAgencyController],
  providers: [PublicAgencyService],
})
export class PublicAgencyModule {}
