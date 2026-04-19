import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { TypeUser } from '../enum/type-user.enum';
import { RoleEnum } from 'src/common/enum/role.enum';

export class CreateUserDtoAdmin extends CreateUserDto {
  @IsEnum(TypeUser)
  @IsNotEmpty()
  typeUser: TypeUser;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: RoleEnum;
}
