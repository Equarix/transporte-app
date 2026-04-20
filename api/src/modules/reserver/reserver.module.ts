import { Module } from '@nestjs/common';
import { ReserverService } from './reserver.service';
import { ReserverController } from './reserver.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserver } from './entities/reserver.entity';
import { Destination } from '../destination/entities/destination.entity';
import { Bus } from '../bus/entities/bus.entity';
import { Profile } from '../user/entities/profile.entity';
import { Floor } from '../bus/entities/floor.entity';
import { Agency } from '../agency/entities/agency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reserver,
      Profile,
      Destination,
      Bus,
      Floor,
      Agency,
    ]),
  ],
  controllers: [ReserverController],
  providers: [ReserverService],
})
export class ReserverModule {}
