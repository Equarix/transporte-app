import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResenaService } from './resena.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';

@Controller()
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}

  @MessagePattern('createResena')
  create(@Payload() createResenaDto: CreateResenaDto) {
    return this.resenaService.create(createResenaDto);
  }

  @MessagePattern('findAllResena')
  findAll() {
    return this.resenaService.findAll();
  }

  @MessagePattern('findOneResena')
  findOne(@Payload() id: number) {
    return this.resenaService.findOne(id);
  }

  @MessagePattern('updateResena')
  update(@Payload() updateResenaDto: UpdateResenaDto) {
    return this.resenaService.update(updateResenaDto.id, updateResenaDto);
  }

  @MessagePattern('removeResena')
  remove(@Payload() id: number) {
    return this.resenaService.remove(id);
  }

  @MessagePattern('findReviewedSaleIds')
  findReviewedSaleIds(@Payload() payload: { userId: number; saleIds: number[] }) {
    return this.resenaService.findReviewedSaleIds(payload.userId, payload.saleIds);
  }

  @MessagePattern('getResenaMetrics')
  getResenaMetrics() {
    return this.resenaService.getMetrics();
  }
}
