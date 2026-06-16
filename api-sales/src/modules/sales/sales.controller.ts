import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesService } from './sales.service';
import { CreateSaleDtoService } from './dto/create-sale.dto';

@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @MessagePattern('createSale')
  create(@Payload() createSaleDto: CreateSaleDtoService) {
    return this.salesService.create(createSaleDto);
  }

  @MessagePattern('findAllSales')
  findAll() {
    return this.salesService.findAll();
  }

  @MessagePattern('getSalesReport')
  getSalesReport() {
    return this.salesService.getSalesReport();
  }

  @MessagePattern('findOneSale')
  findOne(@Payload() id: number) {
    return this.salesService.findOne(id);
  }

  @MessagePattern('removeSale')
  remove(@Payload() id: number) {
    return this.salesService.remove(id);
  }

  @MessagePattern('getSalesAgentReport')
  getSalesAgentReport() {
    return this.salesService.getSalesAgentReport();
  }

  @MessagePattern('getAgencyReport')
  getAgencyReport() {
    return this.salesService.getAgencyReport();
  }

  @MessagePattern('getRoutesReport')
  getRoutesReport() {
    return this.salesService.getRoutesReport();
  }

  @MessagePattern('findUserSales')
  findUserSales(@Payload() userId: number) {
    return this.salesService.findUserSales(userId);
  }

  @MessagePattern('findUserPendingSales')
  findUserPendingSales(@Payload() userId: number) {
    return this.salesService.findUserPendingSales(userId);
  }

  @MessagePattern('approveSale')
  approveSale(@Payload() saleId: number) {
    return this.salesService.approveSale(saleId);
  }

  @MessagePattern('findOccupiedSeats')
  findOccupiedSeats(@Payload() reserverId: number) {
    return this.salesService.findOccupiedSeats(reserverId);
  }
}
