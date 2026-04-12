import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { FloorService } from './floor.service';
import { UpdateFloorDto } from './dto/UpdateFloor.dto';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';

@Auth([RoleEnum.ADMIN])
@Controller('floor')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Patch(':floorId')
  update(
    @Param('floorId') floorId: string,
    @Body() updateFloorDto: UpdateFloorDto,
  ) {
    return this.floorService.update(+floorId, updateFloorDto);
  }

  @Delete(':floorId')
  remove(@Param('floorId') floorId: string) {
    return this.floorService.remove(+floorId);
  }
}
