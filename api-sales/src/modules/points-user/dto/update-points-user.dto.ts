import { PartialType } from '@nestjs/mapped-types';
import { CreatePointsUserDto } from './create-points-user.dto';

export class UpdatePointsUserDto extends PartialType(CreatePointsUserDto) {
  id: number;
}
