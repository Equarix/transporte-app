import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReserverService } from './reserver.service';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { PaginateDto } from 'src/common/utils/paginate.dto';
import { CreateReserverDto } from './dto/create-reserver.dto';
import { UpdateStatusReserverDto } from './dto/update-status.dto';

@Auth([RoleEnum.ADMIN])
@Controller('reserver')
export class ReserverController {
  constructor(private readonly reserverService: ReserverService) {}

  @Get()
  findAll(@Query() query: PaginateDto) {
    return this.reserverService.getAll(query);
  }

  @Post()
  create(@Body() createReserverDto: CreateReserverDto) {
    return this.reserverService.create(createReserverDto);
  }

  @Put(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusReserverDto,
  ) {
    return this.reserverService.updateStatus(+id, updateStatusDto);
  }
}
