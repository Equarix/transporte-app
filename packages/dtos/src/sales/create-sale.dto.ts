import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateSaleDto {
  @IsNumber()
  @IsNotEmpty()
  clientId: number;
}
