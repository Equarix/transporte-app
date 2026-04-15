import { Module } from '@nestjs/common';
import { ReserverService } from './reserver.service';
import { ReserverController } from './reserver.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserver } from './entities/reserver.entity';
import { User } from '../auth/entities/user.entity';
import { Destination } from '../destination/entities/destination.entity';
import { Bus } from '../bus/entities/bus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserver, User, Destination, Bus])],
  controllers: [ReserverController],
  providers: [ReserverService],
})
export class ReserverModule {}
