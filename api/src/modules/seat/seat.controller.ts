import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { SeatService } from './seat.service';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { UpdateSeatDto } from './dto/UpdateSeat.dto';

@Auth([RoleEnum.ADMIN])
@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Patch(':seatId')
  update(
    @Param('seatId') seatId: string,
    @Body() updateSeatDto: UpdateSeatDto,
  ) {
    return this.seatService.update(+seatId, updateSeatDto);
  }

  @Delete(':seatId')
  remove(@Param('seatId') seatId: string) {
    return this.seatService.remove(+seatId);
  }
}
