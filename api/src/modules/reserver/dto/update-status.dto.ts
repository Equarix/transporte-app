import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusReserverEnum } from '../enum/status-reserver.enum';
import { Type } from 'class-transformer';

export class UpdateStatusReserverDto {
  @IsEnum(StatusReserverEnum)
  @Type(() => String)
  @IsNotEmpty()
  status: StatusReserverEnum;
}
