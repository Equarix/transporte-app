import { PaginateDto } from 'src/common/utils/paginate.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/common/enum/role.enum';

export class QueryUserDto extends PaginateDto {
  @IsOptional()
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @IsOptional()
  @IsString()
  documentNumber: string;
}
