import { Module } from '@nestjs/common';
import { PublicAgencyService } from './public-agency.service';
import { PublicAgencyController } from './public-agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from 'src/modules/agency/entities/agency.entity';
import { Reserver } from 'src/modules/reserver/entities/reserver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, Reserver])],
  controllers: [PublicAgencyController],
  providers: [PublicAgencyService],
})
export class PublicAgencyModule {}
