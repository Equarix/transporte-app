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
import { PointsUser, TypePointsMovement, PointsFrom } from '../points-user/entities/points-user.entity';

@Injectable()
export class PromosService {
  constructor(
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
    @InjectRepository(PromoRedemption)
    private readonly redemptionRepository: Repository<PromoRedemption>,
    @InjectRepository(PointsUser)
    private readonly pointsUserRepository: Repository<PointsUser>,
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

  async findActivePromosByUser(userId: number): Promise<PromoResponseDto[]> {
    // 1. Obtener los movimientos de puntos del usuario correspondientes a canjes
    const pointRedemptions = await this.pointsUserRepository.find({
      where: {
        userId,
        pointsFrom: PointsFrom.REWARD,
        type: TypePointsMovement.SUBTRACTION,
      },
    });

    // 2. Por cada movimiento, asegurar que exista la redención de promo correspondiente
    for (const pm of pointRedemptions) {
      let promoCode = '';
      let promoName = '';
      let promoDescription = '';
      let promoType = PromoType.DESCUENTO;
      let discountMode: DiscountMode | null = null;
      let discountValue = 0;
      let giftDescription: string | null = null;

      // Mapear por los puntos restados (8 -> DESC15, 12 -> UPGRADE_SUITE, 6 -> DESAYUNO_BORDO)
      if (pm.points === 8 || pm.points === 800) {
        promoCode = 'DESC15';
        promoName = '15% Descuento';
        promoDescription = 'Descuento del 15% en tu próximo pasaje nacional.';
        promoType = PromoType.DESCUENTO;
        discountMode = DiscountMode.PORCENTAJE;
        discountValue = 15;
      } else if (pm.points === 12 || pm.points === 1200) {
        promoCode = 'UPGRADE_SUITE';
        promoName = 'Upgrade a Suite Class';
        promoDescription = 'Sube de categoría a Suite Class y viaja con la máxima comodidad.';
        promoType = PromoType.DESCUENTO;
        discountMode = DiscountMode.PORCENTAJE;
        discountValue = 100;
      } else if (pm.points === 6 || pm.points === 600) {
        promoCode = 'DESAYUNO_BORDO';
        promoName = 'Desayuno a bordo gratis';
        promoDescription = 'Disfruta de un desayuno de cortesía durante tu viaje.';
        promoType = PromoType.REGALO;
        giftDescription = 'Desayuno a bordo';
      } else {
        continue; // Desconocido
      }

      // Buscar si ya existe la promo
      let promo = await this.promoRepository.findOne({
        where: { code: promoCode },
      });

      if (!promo) {
        const now = new Date();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(now.getFullYear() + 1);

        promo = this.promoRepository.create({
          code: promoCode,
          name: promoName,
          description: promoDescription,
          promoType,
          discountMode: discountMode ?? undefined,
          discountValue,
          giftDescription: giftDescription ?? undefined,
          startsAt: now,
          expiresAt: oneYearFromNow,
          status: PromoStatus.ACTIVO,
          minimumPurchaseAmount: 0,
          createdByUserId: 1, // Admin por defecto
        });
        promo = await this.promoRepository.save(promo);
      }

      // Contar cuántas redenciones existen para este usuario y esta promo
      const redemptionCount = await this.redemptionRepository.count({
        where: {
          userId,
          promo: { promoId: promo.promoId },
        },
      });

      // Contar cuántos movimientos de puntos con este puntaje tiene el usuario
      const pmCount = pointRedemptions.filter(p => p.points === pm.points).length;

      // Si faltan redenciones, crearlas en estado PENDIENTE y saleId = 0
      if (redemptionCount < pmCount) {
        const diff = pmCount - redemptionCount;
        for (let i = 0; i < diff; i++) {
          const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          const uniqueCode = `${promoCode}-${randomSuffix}`;
          const newRed = this.redemptionRepository.create({
            userId,
            saleId: 0,
            discountApplied: 0,
            giftDelivered: giftDescription ?? undefined,
            status: RedemptionStatus.PENDIENTE,
            promo,
            code: uniqueCode,
          });
          await this.redemptionRepository.save(newRed);
        }
      }
    }

    // 3. Obtener todas las redenciones PENDIENTES actualizadas
    const redemptions = await this.redemptionRepository.find({
      where: {
        userId,
        status: RedemptionStatus.PENDIENTE,
      },
      relations: ['promo'],
    });

    const now = new Date();
    const activeRedemptions = redemptions.filter((r) => {
      const promo = r.promo;
      if (!promo || promo.deletedAt !== null || promo.status !== PromoStatus.ACTIVO) {
        return false;
      }
      return promo.startsAt <= now && promo.expiresAt >= now;
    });

    return activeRedemptions.map((r) => {
      const dto = this.toResponseDto(r.promo);
      dto.code = r.code || r.promo.code; // Override generic code with unique code
      return dto;
    });
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
  ): Promise<{ valid: boolean; message: string; discountAmount?: number }> {
    const now = new Date();
    
    // Check if it's a unique single-use code (e.g. DESC15-ABCD)
    const isUniqueCode = dto.code.includes('-');
    let promo: Promo | null = null;
    let pendingRedemption: PromoRedemption | null = null;

    if (isUniqueCode) {
      pendingRedemption = await this.redemptionRepository.findOne({
        where: {
          code: dto.code,
          userId: dto.userId,
          status: RedemptionStatus.PENDIENTE,
        },
        relations: ['promo'],
      });

      if (!pendingRedemption) {
        return { valid: false, message: 'Código de cupón único inválido, ya utilizado o de otro usuario' };
      }
      promo = pendingRedemption.promo;
    } else {
      // It's a generic code. Ensure it's not a points-only promo code
      const pointPromoCodes = ['DESC15', 'UPGRADE_SUITE', 'DESAYUNO_BORDO'];
      if (pointPromoCodes.includes(dto.code)) {
        return {
          valid: false,
          message: 'Esta promoción requiere que ingreses tu código único de cupón (ej. DESC15-XXXX)',
        };
      }

      promo = await this.promoRepository.findOne({
        where: {
          code: dto.code,
          status: PromoStatus.ACTIVO,
          startsAt: LessThanOrEqual(now),
          expiresAt: MoreThanOrEqual(now),
        },
      });
    }

    if (!promo || promo.status !== PromoStatus.ACTIVO || promo.deletedAt !== null) {
      return { valid: false, message: 'Código de promo inválido o expirado' };
    }

    if (promo.startsAt > now || promo.expiresAt < now) {
      return { valid: false, message: 'Esta promo no está activa en este rango de fechas' };
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
        message: `El monto mínimo para esta promo es S/ ${promo.minimumPurchaseAmount}`,
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

    const discountAmount = this.calculateDiscount(promo, dto.purchaseAmount);
    return { valid: true, message: 'Promo válida', discountAmount };
  }

  // ─── Canje ─────────────────────────────────────────────────────────────────

  async redeem(dto: RedeemPromoDto): Promise<RedemptionResultDto> {
    const validation = await this.validate(dto);
    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    const isUniqueCode = dto.code.includes('-');
    let promo: Promo;
    let redemption: PromoRedemption | null = null;

    if (isUniqueCode) {
      redemption = await this.redemptionRepository.findOne({
        where: {
          code: dto.code,
          userId: dto.userId,
          status: RedemptionStatus.PENDIENTE,
        },
        relations: ['promo'],
      });
      if (!redemption) {
        throw new BadRequestException('Cupón no encontrado o ya utilizado');
      }
      promo = redemption.promo;
    } else {
      const now = new Date();
      promo = await this.promoRepository.findOneOrFail({
        where: {
          code: dto.code,
          status: PromoStatus.ACTIVO,
          startsAt: LessThanOrEqual(now),
          expiresAt: MoreThanOrEqual(now),
        },
      });
    }

    const discountAmount = this.calculateDiscount(promo, dto.purchaseAmount);

    if (redemption) {
      redemption.saleId = dto.saleId;
      redemption.discountApplied = discountAmount;
      redemption.status = RedemptionStatus.APLICADO;
    } else {
      redemption = new PromoRedemption();
      redemption.saleId = dto.saleId;
      redemption.userId = dto.userId;
      redemption.discountApplied = discountAmount;
      redemption.giftDelivered =
        promo.promoType === PromoType.REGALO
          ? (promo.giftDescription ?? undefined)
          : undefined;
      redemption.status = RedemptionStatus.APLICADO;
      redemption.promo = promo;
      redemption.code = dto.code;
    }

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
