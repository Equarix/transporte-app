import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { TypeUser } from '../enum/type-user.enum';

export class CreateUserDtoAdmin extends CreateUserDto {
  @IsEnum(TypeUser)
  @IsNotEmpty()
  typeUser: TypeUser;
}
