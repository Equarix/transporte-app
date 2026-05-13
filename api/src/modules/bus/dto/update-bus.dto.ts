import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { TypeSeat } from '../entities/seat.entity';
import { Type } from 'class-transformer';

export class SeatDto {
  @IsNumber()
  @IsNotEmpty()
  seatId: number;

  @IsString()
  @ValidateIf((o) => o.typeSeat !== TypeSeat.ASIENTO)
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

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}

export class FloorDto {
  @IsNumber()
  @IsNotEmpty()
  floorId: number;

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

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}

export class UpdateBusDto {
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
