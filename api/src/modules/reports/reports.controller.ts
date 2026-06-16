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
}
