import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginateDto {
  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsNumber()
  @Type(() => Number)
  limit: number;
}
