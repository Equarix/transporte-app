import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum TypeDocument {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsEnum(TypeDocument)
  typeDocument: TypeDocument;

  @IsNotEmpty()
  @IsString()
  documentNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;
}
