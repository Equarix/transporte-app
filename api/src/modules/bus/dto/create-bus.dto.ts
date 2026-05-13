import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TypeSeat } from '../entities/seat.entity';

export class SeatDto {
  @IsString()
  @ValidateIf((o) => o.typeSeat == TypeSeat.ASIENTO)
  @IsNotEmpty()
  name: string;

  @IsEnum(TypeSeat)
  @IsNotEmpty()
  typeSeat: TypeSeat;

  @IsNumber()
  @IsNotEmpty()
  row: number;

  @IsNumber()
  @IsNotEmpty()
  column: number;
}

export class FloorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsNumber()
  @IsNotEmpty()
  columns: number;

  @IsNumber()
  @IsNotEmpty()
  rows: number;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  @ArrayMinSize(1)
  seats: SeatDto[];
}

export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FloorDto)
  @ArrayMinSize(1)
  floors: FloorDto[];
}
