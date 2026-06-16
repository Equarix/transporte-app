import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { CreatePromoGatewayDto } from './create-promo.dto';

export class UpdatePromoGatewayDto extends PartialType(CreatePromoGatewayDto) {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;
}
