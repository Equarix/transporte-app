import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreatePromoGatewayDto } from './dto/create-promo.dto';
import { UpdatePromoGatewayDto } from './dto/update-promo.dto';
import { RedeemPromoGatewayDto } from './dto/redeem-promo.dto';

@Injectable()
export class PromosGatewayService {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientProxy,
  ) {}

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  async create(dto: CreatePromoGatewayDto, createdByUserId: number) {
    return firstValueFrom(
      this.paymentClient.send('createPromo', {
        ...dto,
        createdByUserId,
      }),
    );
  }

  async findAll() {
    return firstValueFrom(this.paymentClient.send('findAllPromos', {}));
  }

  async findOne(id: number) {
    return firstValueFrom(this.paymentClient.send('findOnePromo', id));
  }

  async update(id: number, dto: UpdatePromoGatewayDto, updatedByUserId: number) {
    return firstValueFrom(
      this.paymentClient.send('updatePromo', {
        ...dto,
        id,
        updatedByUserId,
      }),
    );
  }

  async remove(id: number, deletedByUserId: number) {
    return firstValueFrom(
      this.paymentClient.send('removePromo', { id, deletedByUserId }),
    );
  }

  // ─── Canje ─────────────────────────────────────────────────────────────────

  async validate(dto: RedeemPromoGatewayDto, userId: number) {
    return firstValueFrom(
      this.paymentClient.send('validatePromo', { ...dto, userId }),
    );
  }

  async redeem(dto: RedeemPromoGatewayDto, userId: number) {
    return firstValueFrom(
      this.paymentClient.send('redeemPromo', { ...dto, userId }),
    );
  }
}
