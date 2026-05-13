import { Controller, Get, Query } from '@nestjs/common';
import { PublicBookingService } from './public-booking.service';
import { QueryDestinationDto } from './dto/query-destination.dto';

@Controller('public/booking')
export class PublicBookingController {
  constructor(private readonly publicBookingService: PublicBookingService) {}

  @Get('/destinations')
  async getDestinations(@Query() query: QueryDestinationDto) {
    return this.publicBookingService.getDestinations(query);
  }
}
