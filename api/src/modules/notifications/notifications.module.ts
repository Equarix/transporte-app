import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationAlert } from './entities/notification-alert.entity';
import { Profile } from '../user/entities/profile.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([NotificationAlert, Profile]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
