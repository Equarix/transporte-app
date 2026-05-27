import { Module } from '@nestjs/common';
import { PublicDestinationService } from './public-destination.service';
import { PublicDestinationController } from './public-destination.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from 'src/modules/destination/entities/destination.entity';
import { Reserver } from 'src/modules/reserver/entities/reserver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Destination, Reserver])],
  controllers: [PublicDestinationController],
  providers: [PublicDestinationService],
})
export class PublicDestinationModule {}
