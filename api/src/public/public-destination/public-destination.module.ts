import { Module } from '@nestjs/common';
import { PublicDestinationService } from './public-destination.service';
import { PublicDestinationController } from './public-destination.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from 'src/modules/destination/entities/destination.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Destination])],
  controllers: [PublicDestinationController],
  providers: [PublicDestinationService],
})
export class PublicDestinationModule {}
