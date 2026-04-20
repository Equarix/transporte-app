import { Controller, Get, Param } from '@nestjs/common';
import { PublicAgencyService } from './public-agency.service';

@Controller('public/agency')
export class PublicAgencyController {
  constructor(private readonly publicAgencyService: PublicAgencyService) {}

  @Get()
  findAll() {
    return this.publicAgencyService.getAgency();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.publicAgencyService.getDetails(slug);
  }
}
