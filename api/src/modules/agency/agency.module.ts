import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { Galery } from '../galery/entities/galery.entity';
import { AgencyServiceEntity } from './entities/agency-services.entity';
import { UserAgency } from '../auth/entities/user-agency.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agency,
      Galery,
      AgencyServiceEntity,
      UserAgency,
      User,
    ]),
  ],
  controllers: [AgencyController],
  providers: [AgencyService],
})
export class AgencyModule {}
