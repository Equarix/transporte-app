import { CreateSaleDto } from '@transporte/dtos';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSaleDtoService extends CreateSaleDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
