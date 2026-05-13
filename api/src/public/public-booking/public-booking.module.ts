import { Module } from '@nestjs/common';
import { PublicBookingService } from './public-booking.service';
import { PublicBookingController } from './public-booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from 'src/modules/destination/entities/destination.entity';
import { Reserver } from 'src/modules/reserver/entities/reserver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Destination, Reserver])],
  controllers: [PublicBookingController],
  providers: [PublicBookingService],
})
export class PublicBookingModule {}
