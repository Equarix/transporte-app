import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TypeDocument } from 'src/modules/user/dto/create-user.dto';

export class LoginDto {
  @IsNotEmpty()
  @IsEnum(TypeDocument)
  typeDocument: TypeDocument;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
