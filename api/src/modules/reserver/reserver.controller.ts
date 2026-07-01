import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReserverService } from './reserver.service';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { CreateReserverDto } from './dto/create-reserver.dto';
import { UpdateStatusReserverDto } from './dto/update-status.dto';
import { GetReserversDto } from './dto/get-reservers.dto';
import { User } from 'src/common/decorator/user/user.decorator';

@Auth([RoleEnum.ADMIN])
@Controller('reserver')
export class ReserverController {
  constructor(private readonly reserverService: ReserverService) {}

  @Get()
  findAll(@Query() query: GetReserversDto) {
    return this.reserverService.getAll(query);
  }

  @Post()
  create(
    @Body() createReserverDto: CreateReserverDto,
    @User('userId') userId: number,
  ) {
    return this.reserverService.create(createReserverDto, userId);
  }

  @Put(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusReserverDto,
  ) {
    return this.reserverService.updateStatus(+id, updateStatusDto);
  }
}
