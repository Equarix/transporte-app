import { PartialType } from '@nestjs/mapped-types';
import { CreatePromoDto } from './create-promo.dto';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdatePromoDto extends PartialType(CreatePromoDto) {
  @IsInt()
  @IsPositive()
  id: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  updatedByUserId: number;
}
