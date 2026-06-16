import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class RedeemPromoGatewayDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  code: string;

  @IsInt()
  @IsPositive()
  saleId: number;

  @IsNumber()
  @IsPositive()
  purchaseAmount: number;
}
