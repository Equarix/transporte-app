import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateResenaGatewayDto {
  @IsInt()
  @IsNotEmpty()
  saleId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  comfortScore: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  punctualityScore: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  serviceScore: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  driverScore: number;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  comment?: string;
}
