import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class RedeemPromoDto {
  /** Código de la promo a canjear */
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  code: string;

  /** ID de la venta a la que se aplica el canje */
  @IsInt()
  @IsPositive()
  saleId: number;

  /** Usuario que realiza el canje */
  @IsInt()
  @IsPositive()
  userId: number;

  /** Monto total de la compra para calcular el descuento */
  @IsNumber()
  @IsPositive()
  purchaseAmount: number;
}
