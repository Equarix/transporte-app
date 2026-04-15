import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReserverDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  checkInId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  checkOutId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  busId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  driverId: number;
}
