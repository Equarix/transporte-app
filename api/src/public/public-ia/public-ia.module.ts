import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PublicIaController } from './public-ia.controller';
import { PublicIaService } from './public-ia.service';

@Module({
  imports: [HttpModule],
  controllers: [PublicIaController],
  providers: [PublicIaService],
})
export class PublicIaModule {}
