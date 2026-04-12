import { Module } from '@nestjs/common';
import { GaleryService } from './galery.service';
import { GaleryController } from './galery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Galery } from './entities/galery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Galery])],
  controllers: [GaleryController],
  providers: [GaleryService],
})
export class GaleryModule { }
