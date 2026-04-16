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
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { PaginateDto } from 'src/common/utils/paginate.dto';

@Auth([RoleEnum.ADMIN])
@Controller('destination')
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @Post()
  create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationService.create(createDestinationDto);
  }

  @Get()
  findAll(@Query() query: PaginateDto) {
    return this.destinationService.findAll(query);
  }

  @Get('get-all')
  getAll() {
    return this.destinationService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.destinationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationService.update(+id, updateDestinationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.destinationService.remove(+id);
  }
}
