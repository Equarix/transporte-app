import { IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/common/utils/paginate.dto';

export class GetReserversDto extends PaginateDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  checkInId?: string;

  @IsOptional()
  @IsString()
  checkOutId?: string;
}
