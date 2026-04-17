import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { Galery } from '../galery/entities/galery.entity';
import { AgencyServiceEntity } from './entities/agency-services.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, Galery, AgencyServiceEntity])],
  controllers: [AgencyController],
  providers: [AgencyService],
})
export class AgencyModule {}
