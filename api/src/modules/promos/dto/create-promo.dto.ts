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

export class CreatePromoGatewayDto {
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

  @ValidateIf((o: CreatePromoGatewayDto) => o.promoType === PromoType.DESCUENTO)
  @IsEnum(DiscountMode)
  discountMode?: DiscountMode;

  @ValidateIf((o: CreatePromoGatewayDto) => o.promoType === PromoType.DESCUENTO)
  @IsNumber()
  @IsPositive()
  discountValue?: number;

  @ValidateIf(
    (o: CreatePromoGatewayDto) =>
      o.promoType === PromoType.DESCUENTO &&
      o.discountMode === DiscountMode.PORCENTAJE,
  )
  @IsNumber()
  @Min(0)
  @Max(100)
  maxDiscountCap?: number;

  @ValidateIf((o: CreatePromoGatewayDto) => o.promoType === PromoType.REGALO)
  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  giftDescription?: string;

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
}
