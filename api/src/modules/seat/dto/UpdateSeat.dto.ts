import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TypeSeat } from 'src/modules/bus/entities/seat.entity';

export class UpdateSeatDto {
  @IsString()
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
