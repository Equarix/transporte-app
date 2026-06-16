import {
  DiscountMode,
  PromoApplicableTo,
  PromoStatus,
  PromoType,
} from '../entities/promo.entity';

export class RedemptionResultDto {
  /** Indica si el canje fue exitoso */
  success: boolean;

  /** Código de la promo */
  code: string;

  /** Tipo de promo aplicada */
  promoType: PromoType;

  /** Monto de descuento calculado (0 si es REGALO) */
  discountAmount: number;

  /** Descripción del regalo si aplica */
  giftDescription: string | null;

  /** Precio final tras aplicar el descuento */
  finalAmount: number;

  /** ID del registro de canje creado */
  redemptionId: number;
}

export class PromoResponseDto {
  promoId: number;
  code: string;
  name: string;
  description: string | null;
  promoType: PromoType;
  discountMode: DiscountMode | null;
  discountValue: number | null;
  maxDiscountCap: number | null;
  giftDescription: string | null;
  applicableTo: PromoApplicableTo;
  minimumPurchaseAmount: number;
  applicableRouteIds: string | null;
  applicableAgencyIds: string | null;
  startsAt: Date;
  expiresAt: Date;
  maxGlobalUses: number | null;
  maxUsesPerUser: number | null;
  totalUses: number;
  status: PromoStatus;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: number;
}
