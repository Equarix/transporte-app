import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  DiscountMode,
  Promo,
  PromoStatus,
  PromoType,
} from './entities/promo.entity';
import {
  PromoRedemption,
  RedemptionStatus,
} from './entities/promo-redemption.entity';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { RedeemPromoDto } from './dto/redeem-promo.dto';
import {
  PromoResponseDto,
  RedemptionResultDto,
} from './dto/promo-response.dto';

@Injectable()
export class PromosService {
  constructor(
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
    @InjectRepository(PromoRedemption)
    private readonly redemptionRepository: Repository<PromoRedemption>,
  ) {}

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  async create(dto: CreatePromoDto): Promise<PromoResponseDto> {
    const existing = await this.promoRepository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new BadRequestException(
        `Ya existe una promo con el código "${dto.code}"`,
      );
    }

    const promo = this.promoRepository.create({
      ...dto,
      startsAt: new Date(dto.startsAt),
      expiresAt: new Date(dto.expiresAt),
      status: PromoStatus.ACTIVO,
      totalUses: 0,
    });

    const saved = await this.promoRepository.save(promo);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<PromoResponseDto[]> {
    const promos = await this.promoRepository.find({
      where: { deletedAt: undefined },
      order: { createdAt: 'DESC' },
    });
    return promos.map((p) => this.toResponseDto(p));
  }

  async findOne(id: number): Promise<PromoResponseDto> {
    const promo = await this.findActivePromoById(id);
    return this.toResponseDto(promo);
  }

  async update(id: number, dto: UpdatePromoDto): Promise<PromoResponseDto> {
    const promo = await this.findActivePromoById(id);

    if (dto.code && dto.code !== promo.code) {
      const existing = await this.promoRepository.findOne({
        where: { code: dto.code },
      });
      if (existing) {
        throw new BadRequestException(
          `Ya existe una promo con el código "${dto.code}"`,
        );
      }
    }

    const updated = this.promoRepository.merge(promo, {
      ...dto,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : promo.startsAt,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : promo.expiresAt,
      updatedByUserId: dto.updatedByUserId,
    });

    const saved = await this.promoRepository.save(updated);
    return this.toResponseDto(saved);
  }

  async remove(id: number, deletedByUserId: number): Promise<void> {
    const promo = await this.findActivePromoById(id);
    promo.deletedAt = new Date();
    promo.deletedByUserId = deletedByUserId;
    promo.status = PromoStatus.INACTIVO;
    await this.promoRepository.save(promo);
  }

  // ─── Validación previa al canje ────────────────────────────────────────────

  async validate(
    dto: RedeemPromoDto,
  ): Promise<{ valid: boolean; message: string }> {
    const now = new Date();
    const promo = await this.promoRepository.findOne({
      where: {
        code: dto.code,
        status: PromoStatus.ACTIVO,
        startsAt: LessThanOrEqual(now),
        expiresAt: MoreThanOrEqual(now),
      },
    });

    if (!promo) {
      return { valid: false, message: 'Código de promo inválido o expirado' };
    }

    if (
      promo.maxGlobalUses !== null &&
      promo.totalUses >= promo.maxGlobalUses
    ) {
      return { valid: false, message: 'Esta promo ya alcanzó su límite de usos' };
    }

    if (dto.purchaseAmount < promo.minimumPurchaseAmount) {
      return {
        valid: false,
        message: `El monto mínimo para esta promo es $${promo.minimumPurchaseAmount}`,
      };
    }

    if (promo.maxUsesPerUser !== null) {
      const userUses = await this.redemptionRepository.count({
        where: {
          userId: dto.userId,
          promo: { promoId: promo.promoId },
          status: RedemptionStatus.APLICADO,
        },
      });
      if (userUses >= promo.maxUsesPerUser) {
        return {
          valid: false,
          message: 'Ya utilizaste esta promo el máximo de veces permitido',
        };
      }
    }

    return { valid: true, message: 'Promo válida' };
  }

  // ─── Canje ─────────────────────────────────────────────────────────────────

  async redeem(dto: RedeemPromoDto): Promise<RedemptionResultDto> {
    const validation = await this.validate(dto);
    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    const now = new Date();
    const promo = await this.promoRepository.findOneOrFail({
      where: {
        code: dto.code,
        status: PromoStatus.ACTIVO,
        startsAt: LessThanOrEqual(now),
        expiresAt: MoreThanOrEqual(now),
      },
    });

    const discountAmount = this.calculateDiscount(promo, dto.purchaseAmount);

    const redemption = new PromoRedemption();
    redemption.saleId = dto.saleId;
    redemption.userId = dto.userId;
    redemption.discountApplied = discountAmount;
    redemption.giftDelivered =
      promo.promoType === PromoType.REGALO
        ? (promo.giftDescription ?? undefined)
        : undefined;
    redemption.status = RedemptionStatus.APLICADO;
    redemption.promo = promo;

    const saved = await this.redemptionRepository.save(redemption);

    // Incrementar contador de usos
    promo.totalUses += 1;
    await this.promoRepository.save(promo);

    const result: RedemptionResultDto = {
      success: true,
      code: promo.code,
      promoType: promo.promoType,
      discountAmount,
      giftDescription:
        promo.promoType === PromoType.REGALO
          ? (promo.giftDescription ?? null)
          : null,
      finalAmount: Math.max(0, dto.purchaseAmount - discountAmount),
      redemptionId: (saved as PromoRedemption).redemptionId,
    };
    return result;
  }

  // ─── Helpers privados ──────────────────────────────────────────────────────

  private async findActivePromoById(id: number): Promise<Promo> {
    const promo = await this.promoRepository.findOne({
      where: { promoId: id },
    });

    if (!promo || promo.deletedAt !== null) {
      throw new NotFoundException(`Promo con ID ${id} no encontrada`);
    }

    return promo;
  }

  private calculateDiscount(promo: Promo, purchaseAmount: number): number {
    if (promo.promoType === PromoType.REGALO) return 0;
    if (!promo.discountMode || promo.discountValue === null) return 0;

    if (promo.discountMode === DiscountMode.MONTO_FIJO) {
      return Math.min(promo.discountValue, purchaseAmount);
    }

    // PORCENTAJE
    const rawDiscount = (purchaseAmount * promo.discountValue) / 100;
    const cap =
      promo.maxDiscountCap !== null ? promo.maxDiscountCap : rawDiscount;
    return Math.min(rawDiscount, cap);
  }

  private toResponseDto(promo: Promo): PromoResponseDto {
    return {
      promoId: promo.promoId,
      code: promo.code,
      name: promo.name,
      description: promo.description ?? null,
      promoType: promo.promoType,
      discountMode: promo.discountMode ?? null,
      discountValue: promo.discountValue ?? null,
      maxDiscountCap: promo.maxDiscountCap ?? null,
      giftDescription: promo.giftDescription ?? null,
      applicableTo: promo.applicableTo,
      minimumPurchaseAmount: promo.minimumPurchaseAmount,
      applicableRouteIds: promo.applicableRouteIds ?? null,
      applicableAgencyIds: promo.applicableAgencyIds ?? null,
      startsAt: promo.startsAt,
      expiresAt: promo.expiresAt,
      maxGlobalUses: promo.maxGlobalUses ?? null,
      maxUsesPerUser: promo.maxUsesPerUser ?? null,
      totalUses: promo.totalUses,
      status: promo.status,
      createdAt: promo.createdAt,
      updatedAt: promo.updatedAt,
      createdByUserId: promo.createdByUserId,
    };
  }
}
