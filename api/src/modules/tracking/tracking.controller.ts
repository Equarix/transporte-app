import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { TrackingService } from './tracking.service';

@Controller('tracking')
@Auth([RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SELLER])
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(':reserverId')
  async getTracking(@Param('reserverId') reserverId: string) {
    return this.trackingService.getTracking(+reserverId);
  }
}
