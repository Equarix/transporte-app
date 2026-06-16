import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PointsUserService } from './points-user.service';
import { CreatePointsUserDto } from './dto/create-points-user.dto';
import { UpdatePointsUserDto } from './dto/update-points-user.dto';

@Controller()
export class PointsUserController {
  constructor(private readonly pointsUserService: PointsUserService) {}

  @MessagePattern('createPointsUser')
  create(@Payload() createPointsUserDto: CreatePointsUserDto) {
    return this.pointsUserService.create(createPointsUserDto);
  }

  @MessagePattern('findAllPointsUser')
  findAll() {
    return this.pointsUserService.findAll();
  }

  @MessagePattern('findOnePointsUser')
  findOne(@Payload() id: number) {
    return this.pointsUserService.findOne(id);
  }

  @MessagePattern('updatePointsUser')
  update(@Payload() updatePointsUserDto: UpdatePointsUserDto) {
    return this.pointsUserService.update(updatePointsUserDto.id, updatePointsUserDto);
  }

  @MessagePattern('removePointsUser')
  remove(@Payload() id: number) {
    return this.pointsUserService.remove(id);
  }

  @MessagePattern('getPointsReport')
  getPointsReport() {
    return this.pointsUserService.getPointsReport();
  }

  @MessagePattern('getUserPoints')
  getUserPoints(@Payload() userId: number) {
    return this.pointsUserService.getUserPoints(userId);
  }

  @MessagePattern('redeemPoints')
  redeemPoints(@Payload() data: { userId: number; rewardId: string; points: number }) {
    return this.pointsUserService.redeemPoints(data.userId, data.rewardId, data.points);
  }
}
