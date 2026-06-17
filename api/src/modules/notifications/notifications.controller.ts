import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { User } from 'src/common/decorator/user/user.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@Auth([RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SELLER])
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('interests')
  async saveInterest(
    @User('userId') userId: number,
    @Body() body: { originId: number; destinationId: number; travelDate: string },
  ) {
    return this.notificationsService.saveInterest(userId, body);
  }

  @Get('interests')
  async getInterests(@User('userId') userId: number) {
    return this.notificationsService.getInterests(userId);
  }

  @Get('alerts')
  async getAlerts(@User('userId') userId: number) {
    return this.notificationsService.getAlerts(userId);
  }

  @Post('whatsapp-simulate')
  async simulateWhatsApp(
    @User('userId') userId: number,
    @Body() body: { phone: string; destinationName: string },
  ) {
    return this.notificationsService.simulateWhatsApp(userId, body.phone, body.destinationName);
  }
}
