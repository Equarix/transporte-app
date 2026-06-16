import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';

@Auth([RoleEnum.ADMIN])
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  async getSalesReport() {
    return this.reportsService.getSalesReport();
  }

  @Get('points')
  async getPointsReport() {
    return this.reportsService.getPointsReport();
  }

  @Get('sales-agents')
  async getSalesAgentReport() {
    return this.reportsService.getSalesAgentReport();
  }

  @Get('agencies')
  async getAgencyReport() {
    return this.reportsService.getAgencyReport();
  }

  @Get('routes')
  async getRoutesReport() {
    return this.reportsService.getRoutesReport();
  }
}
