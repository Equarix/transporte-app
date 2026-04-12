import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateFloorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsNumber()
  @IsNotEmpty()
  rows: number;

  @IsNumber()
  @IsNotEmpty()
  columns: number;

  //   @IsBoolean()
  //   @IsNotEmpty()
  //   status: boolean; MMM...?
}
