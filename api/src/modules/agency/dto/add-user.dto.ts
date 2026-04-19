import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddUserDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  agencyId: number;
}
