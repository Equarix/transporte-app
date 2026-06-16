// ─── Enums ────────────────────────────────────────────────────────────────────

export enum PromoType {
  DESCUENTO = 'DESCUENTO',
  REGALO = 'REGALO',
}

export enum DiscountMode {
  PORCENTAJE = 'PORCENTAJE',
  MONTO_FIJO = 'MONTO_FIJO',
}

export enum PromoApplicableTo {
  TICKET = 'TICKET',
  HOTEL = 'HOTEL',
  AMBOS = 'AMBOS',
}

export enum PromoStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  EXPIRADO = 'EXPIRADO',
}

// ─── Response types ───────────────────────────────────────────────────────────

export interface Promo {
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
  startsAt: string;
  expiresAt: string;
  maxGlobalUses: number | null;
  maxUsesPerUser: number | null;
  totalUses: number;
  status: PromoStatus;
  createdAt: string;
  updatedAt: string;
  createdByUserId: number;
}

export interface RedemptionResult {
  success: boolean;
  code: string;
  promoType: PromoType;
  discountAmount: number;
  giftDescription: string | null;
  finalAmount: number;
  redemptionId: number;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface CreatePromoPayload {
  code: string;
  name: string;
  description?: string;
  promoType: PromoType;
  discountMode?: DiscountMode;
  discountValue?: number;
  maxDiscountCap?: number;
  giftDescription?: string;
  applicableTo: PromoApplicableTo;
  minimumPurchaseAmount?: number;
  applicableRouteIds?: string;
  applicableAgencyIds?: string;
  startsAt: string;
  expiresAt: string;
  maxGlobalUses?: number;
  maxUsesPerUser?: number;
}

export interface UpdatePromoPayload extends Partial<CreatePromoPayload> {
  id: number;
}
