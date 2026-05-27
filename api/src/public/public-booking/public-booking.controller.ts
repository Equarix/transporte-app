import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PublicBookingService } from './public-booking.service';
import { QueryDestinationDto } from './dto/query-destination.dto';
import { Auth } from 'src/common/decorator/auth/auth.decorator';

@Controller('public/booking')
export class PublicBookingController {
  constructor(private readonly publicBookingService: PublicBookingService) {}

  @Get('/destinations')
  async getDestinations(@Query() query: QueryDestinationDto) {
    return this.publicBookingService.getDestinations(query);
  }

  @Get('/bus/:idReservation')
  async getBus(@Param('idReservation') idReservation: string) {
    return this.publicBookingService.getBus(+idReservation);
  }

  @Auth()
  @Post('/pay')
  async pay() {
    return true;
  }
}
