import { Controller, Get, Param } from '@nestjs/common';
import { PublicAgencyService } from './public-agency.service';

@Controller('public/agency')
export class PublicAgencyController {
  constructor(private readonly publicAgencyService: PublicAgencyService) {}

  @Get()
  findAll() {
    return this.publicAgencyService.getAgency();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicAgencyService.getDetails(+id);
  }
}
