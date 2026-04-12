import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Floor } from '../bus/entities/floor.entity';
import { Repository } from 'typeorm';
import { UpdateFloorDto } from './dto/UpdateFloor.dto';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
  ) {}

  async update(id: number, updateFloorDto: UpdateFloorDto) {
    const floor = await this.floorRepository.findOne({
      where: { floorId: id },
    });
    if (!floor) throw new NotFoundException('Floor not found');
    const updatedFloor = await this.floorRepository.update(id, updateFloorDto);
    return updatedFloor;
  }

  async remove(id: number) {
    const floor = await this.floorRepository.findOne({
      where: { floorId: id },
    });
    if (!floor) throw new NotFoundException('Floor not found');
    const updatedFloor = await this.floorRepository.update(id, {
      status: false,
    });
    return updatedFloor;
  }
}
