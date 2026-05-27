import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

/* =========================
   PAYER DTO
========================= */

export class PayerDto {
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsString()
  @IsNotEmpty()
  names: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  motherLastName?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsDateString()
  birthDate: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  lastNames?: string;
}

/* =========================
   PAYMENT METHOD DTO
========================= */

export class PaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

/* =========================
   HOTEL DTO
========================= */

export class HotelDto {
  @IsInt()
  hotelId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  location: string;

  @IsNumber()
  price_per_night: number;

  @IsInt()
  nights: number;

  @IsInt()
  persons: number;

  @IsString()
  ranking: string;

  @IsString()
  lat: string;

  @IsString()
  lng: string;

  @IsString()
  image_name: string;

  @IsString()
  url_image: string;

  @IsString()
  url_map: string;

  @IsString()
  tax_info: string;

  @IsNumber()
  Distance: number;
}

/* =========================
   PASSENGER DTO
========================= */

export class PassengerDto {
  @IsString()
  documentType: string;

  @IsString()
  documentNumber: string;

  @IsString()
  names: string;

  @IsString()
  lastName: string;

  @IsString()
  motherLastName: string;

  @IsString()
  gender: string;

  @IsDateString()
  birthDate: string;

  @IsInt()
  seatId: number;

  @IsString()
  name: string;

  @IsString()
  typeSeat: string;

  @IsBoolean()
  status: boolean;

  @IsInt()
  row: number;

  @IsInt()
  column: number;

  @IsInt()
  floor: number;

  @IsString()
  type: string;

  @IsNumber()
  price: number;
}

/* =========================
   MAIN DTO
========================= */

export class CreateSaleDto {
  @IsInt()
  reserverId: number;

  @ValidateNested()
  @Type(() => PayerDto)
  payer: PayerDto;

  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;

  @IsNumber()
  serviceCharge: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => HotelDto)
  hotel?: HotelDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[];
}
