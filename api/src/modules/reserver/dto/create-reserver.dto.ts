import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ReserverPriceFloorDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  floorId: number;
}

export class ReserverAgencyDto {
  @IsNumber()
  @IsNotEmpty()
  agencyId: number;

  @IsString()
  @IsNotEmpty()
  hour: string;
}

export class CreateReserverDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  checkOutHour: string;

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

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReserverPriceFloorDto)
  @IsNotEmpty()
  reserverPriceFloors: ReserverPriceFloorDto[];

  // @IsArray()
  // @IsNotEmpty()
  // @IsNumber({}, { each: true })
  // @Type(() => Number)
  // agenciesId: number[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReserverAgencyDto)
  @IsNotEmpty()
  reserverAgencies: ReserverAgencyDto[];
}
