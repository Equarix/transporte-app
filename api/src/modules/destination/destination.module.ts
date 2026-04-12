import { Module } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { DestinationController } from './destination.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experiences.entity';
import { Destination } from './entities/destination.entity';
import { Galery } from '../galery/entities/galery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, Destination, Galery])],
  controllers: [DestinationController],
  providers: [DestinationService],
})
export class DestinationModule { }
