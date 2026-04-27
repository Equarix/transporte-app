import { Module } from '@nestjs/common';
import { PointsUserService } from './points-user.service';
import { PointsUserController } from './points-user.controller';

@Module({
  controllers: [PointsUserController],
  providers: [PointsUserService],
})
export class PointsUserModule {}
