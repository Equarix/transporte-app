import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExperienceType } from '../enum/experiencie.enum';
import { Type } from 'class-transformer';

export class CreateExperienceDto {
  @IsEnum(ExperienceType)
  @IsNotEmpty()
  type: ExperienceType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  lat: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  lng: string;

  @IsNumber()
  @IsNotEmpty()
  imageId: number;
}

export class CreateDestinationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  longDescription: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateExperienceDto)
  @ArrayMinSize(1)
  experiences: CreateExperienceDto[];

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  lat: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  lng: string;

  @IsNumber()
  @IsNotEmpty()
  imageId: number;
}
