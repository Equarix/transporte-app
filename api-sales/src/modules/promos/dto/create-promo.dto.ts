import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import {
  DiscountMode,
  PromoApplicableTo,
  PromoType,
} from '../entities/promo.entity';

export class CreatePromoDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsEnum(PromoType)
  promoType: PromoType;

  // ─── Descuento (solo si promoType = DESCUENTO) ───────────────────────────
  @ValidateIf((o: CreatePromoDto) => o.promoType === PromoType.DESCUENTO)
  @IsEnum(DiscountMode)
  discountMode?: DiscountMode;

  @ValidateIf((o: CreatePromoDto) => o.promoType === PromoType.DESCUENTO)
  @IsNumber()
  @IsPositive()
  discountValue?: number;

  @ValidateIf(
    (o: CreatePromoDto) =>
      o.promoType === PromoType.DESCUENTO &&
      o.discountMode === DiscountMode.PORCENTAJE,
  )
  @IsNumber()
  @Min(0)
  @Max(100)
  maxDiscountCap?: number;

  // ─── Regalo (solo si promoType = REGALO) ─────────────────────────────────
  @ValidateIf((o: CreatePromoDto) => o.promoType === PromoType.REGALO)
  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  giftDescription?: string;

  // ─── Alcance ──────────────────────────────────────────────────────────────
  @IsEnum(PromoApplicableTo)
  applicableTo: PromoApplicableTo;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumPurchaseAmount?: number;

  @IsString()
  @IsOptional()
  applicableRouteIds?: string;

  @IsString()
  @IsOptional()
  applicableAgencyIds?: string;

  // ─── Disponibilidad ───────────────────────────────────────────────────────
  @IsDateString()
  startsAt: string;

  @IsDateString()
  expiresAt: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  maxGlobalUses?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  maxUsesPerUser?: number;

  // ─── Auditoría ────────────────────────────────────────────────────────────
  @IsInt()
  @IsPositive()
  createdByUserId: number;
}
