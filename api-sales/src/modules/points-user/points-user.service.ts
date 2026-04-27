import { Injectable } from '@nestjs/common';
import { CreatePointsUserDto } from './dto/create-points-user.dto';
import { UpdatePointsUserDto } from './dto/update-points-user.dto';

@Injectable()
export class PointsUserService {
  create(createPointsUserDto: CreatePointsUserDto) {
    return 'This action adds a new pointsUser';
  }

  findAll() {
    return `This action returns all pointsUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pointsUser`;
  }

  update(id: number, updatePointsUserDto: UpdatePointsUserDto) {
    return `This action updates a #${id} pointsUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} pointsUser`;
  }
}
