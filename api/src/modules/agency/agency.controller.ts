import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AgencyService } from './agency.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { PaginateDto } from 'src/common/utils/paginate.dto';
import { AddUserDto } from './dto/add-user.dto';

@Auth([RoleEnum.ADMIN])
@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Post()
  create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agencyService.create(createAgencyDto);
  }

  @Get()
  findAll(@Query() params: PaginateDto) {
    return this.agencyService.findAll(params);
  }

  @Get('all')
  findAllAgency() {
    return this.agencyService.findAllAgency();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agencyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgencyDto: UpdateAgencyDto) {
    return this.agencyService.update(+id, updateAgencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agencyService.remove(+id);
  }

  @Post('add-user')
  addUser(@Body() addUserDto: AddUserDto) {
    return this.agencyService.addUser(addUserDto);
  }

  @Delete('remove-user')
  removeUser(@Body() removeUserDto: AddUserDto) {
    return this.agencyService.removeUser(removeUserDto);
  }

  @Get('user/:agencyId')
  findUsersAgency(@Param('agencyId') agencyId: string) {
    return this.agencyService.findUsersAgency(+agencyId);
  }
}
