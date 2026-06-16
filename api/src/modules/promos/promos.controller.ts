import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PromosGatewayService } from './promos.service';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { User } from 'src/common/decorator/user/user.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { CreatePromoGatewayDto } from './dto/create-promo.dto';
import { UpdatePromoGatewayDto } from './dto/update-promo.dto';
import { RedeemPromoGatewayDto } from './dto/redeem-promo.dto';

@Controller('promos')
export class PromosController {
  constructor(private readonly promosGatewayService: PromosGatewayService) {}

  // ─── CRUD (solo ADMIN) ─────────────────────────────────────────────────────

  @Auth([RoleEnum.ADMIN])
  @Post()
  create(
    @Body() createPromoDto: CreatePromoGatewayDto,
    @User('userId') userId: number,
  ) {
    return this.promosGatewayService.create(createPromoDto, userId);
  }

  @Auth([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.promosGatewayService.findAll();
  }

  @Auth([RoleEnum.ADMIN])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promosGatewayService.findOne(+id);
  }

  @Auth([RoleEnum.ADMIN])
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromoDto: UpdatePromoGatewayDto,
    @User('userId') userId: number,
  ) {
    return this.promosGatewayService.update(+id, updatePromoDto, userId);
  }

  @Auth([RoleEnum.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string, @User('userId') userId: number) {
    return this.promosGatewayService.remove(+id, userId);
  }

  // ─── Canje (usuarios autenticados) ────────────────────────────────────────

  /**
   * POST /promos/validate
   * Valida si un código aplica a la compra SIN persistir nada.
   * Usar antes del checkout para mostrar el descuento calculado.
   */
  @Auth([RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SELLER])
  @Post('validate')
  validate(
    @Body() redeemPromoDto: RedeemPromoGatewayDto,
    @User('userId') userId: number,
  ) {
    return this.promosGatewayService.validate(redeemPromoDto, userId);
  }

  /**
   * POST /promos/redeem
   * Aplica el canje de la promo. Llamar después de confirmar el pago.
   */
  @Auth([RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SELLER])
  @Post('redeem')
  redeem(
    @Body() redeemPromoDto: RedeemPromoGatewayDto,
    @User('userId') userId: number,
  ) {
    return this.promosGatewayService.redeem(redeemPromoDto, userId);
  }
}
