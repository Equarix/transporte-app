import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PromosService } from './promos.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { RedeemPromoDto } from './dto/redeem-promo.dto';

@Controller()
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  @MessagePattern('createPromo')
  create(@Payload() createPromoDto: CreatePromoDto) {
    return this.promosService.create(createPromoDto);
  }

  @MessagePattern('findAllPromos')
  findAll() {
    return this.promosService.findAll();
  }

  @MessagePattern('findOnePromo')
  findOne(@Payload() id: number) {
    return this.promosService.findOne(id);
  }

  @MessagePattern('updatePromo')
  update(@Payload() updatePromoDto: UpdatePromoDto) {
    return this.promosService.update(updatePromoDto.id, updatePromoDto);
  }

  @MessagePattern('removePromo')
  remove(@Payload() payload: { id: number; deletedByUserId: number }) {
    return this.promosService.remove(payload.id, payload.deletedByUserId);
  }

  // ─── Canje ─────────────────────────────────────────────────────────────────

  /**
   * Valida si un código de promo aplica a una compra ANTES de confirmar el pago.
   * Devuelve el descuento calculado sin persistir nada.
   */
  @MessagePattern('validatePromo')
  validate(@Payload() redeemPromoDto: RedeemPromoDto) {
    return this.promosService.validate(redeemPromoDto);
  }

  /**
   * Aplica el canje de la promo. Persiste el registro y actualiza el contador.
   * Llamar DESPUÉS de confirmar el pago.
   */
  @MessagePattern('redeemPromo')
  redeem(@Payload() redeemPromoDto: RedeemPromoDto) {
    return this.promosService.redeem(redeemPromoDto);
  }
}
