import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from '../bus/entities/seat.entity';
import { Repository } from 'typeorm';
import { UpdateSeatDto } from './dto/UpdateSeat.dto';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async update(id: number, updateSeatDto: UpdateSeatDto) {
    const seat = await this.seatRepository.findOne({
      where: { seatId: id },
    });
    if (!seat) throw new NotFoundException('Seat not found');
    const updatedSeat = await this.seatRepository.update(id, updateSeatDto);
    return updatedSeat;
  }

  async remove(id: number) {
    const seat = await this.seatRepository.findOne({
      where: { seatId: id },
    });
    if (!seat) throw new NotFoundException('Seat not found');
    const updatedSeat = await this.seatRepository.update(id, { status: false });
    return updatedSeat;
  }
}
