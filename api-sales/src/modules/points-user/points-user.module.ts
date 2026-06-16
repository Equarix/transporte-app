import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsUserService } from './points-user.service';
import { PointsUserController } from './points-user.controller';
import { PointsUser } from './entities/points-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PointsUser])],
  controllers: [PointsUserController],
  providers: [PointsUserService],
})
export class PointsUserModule {}
