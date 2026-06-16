import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';
import { Resena } from './entities/resena.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resena])],
  controllers: [ResenaController],
  providers: [ResenaService],
  exports: [ResenaService],
})
export class ResenaModule {}
