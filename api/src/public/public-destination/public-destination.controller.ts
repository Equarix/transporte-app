import { Controller, Get } from '@nestjs/common';
import { PublicDestinationService } from './public-destination.service';

@Controller('public/destination')
export class PublicDestinationController {
  constructor(
    private readonly publicDestinationService: PublicDestinationService,
  ) {}

  @Get()
  async getDestinations() {
    return this.publicDestinationService.getDestinations();
  }
}
