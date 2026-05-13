import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class QueryDestinationDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  checkIn: Date;
}
