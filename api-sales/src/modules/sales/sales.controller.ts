import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesService } from './sales.service';
import { CreateSaleDto } from '@transporte/dtos';

@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @MessagePattern('createSale')
  create(@Payload() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @MessagePattern('findAllSales')
  findAll() {
    return this.salesService.findAll();
  }

  @MessagePattern('findOneSale')
  findOne(@Payload() id: number) {
    return this.salesService.findOne(id);
  }

  @MessagePattern('removeSale')
  remove(@Payload() id: number) {
    return this.salesService.remove(id);
  }
}
