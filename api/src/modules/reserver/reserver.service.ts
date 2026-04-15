import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserver } from './entities/reserver.entity';
import { Repository } from 'typeorm';
import { Destination } from '../destination/entities/destination.entity';
import { Bus } from '../bus/entities/bus.entity';
import { User } from '../auth/entities/user.entity';
import { PaginateDto } from 'src/common/utils/paginate.dto';
import { CreateReserverDto } from './dto/create-reserver.dto';
import { UpdateStatusReserverDto } from './dto/update-status.dto';

@Injectable()
export class ReserverService {
  constructor(
    @InjectRepository(Reserver)
    private readonly reserverRepository: Repository<Reserver>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
  ) {}

  async getAll(paginateDto: PaginateDto) {
    const { limit, page } = paginateDto;

    const [data, total] = await this.reserverRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        registerUser: true,
        checkIn: true,
        checkOut: true,
        bus: true,
        driver: true,
      },
    });

    return {
      data,
      metadata: {
        totalItems: total,
        itemCount: data.length,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async create(createDto: CreateReserverDto) {
    const { busId, checkInId, checkOutId, date, driverId } = createDto;

    const bus = await this.busRepository.findOne({ where: { busId } });
    if (!bus) throw new NotFoundException('Bus no encontrado');

    const checkIn = await this.destinationRepository.findOne({
      where: { destinationId: checkInId },
    });
    if (!checkIn) throw new NotFoundException('CheckIn no encontrado');

    const checkOut = await this.destinationRepository.findOne({
      where: { destinationId: checkOutId },
    });
    if (!checkOut) throw new NotFoundException('CheckOut no encontrado');

    const driver = await this.userRepository.findOne({
      where: { userId: driverId },
    });
    if (!driver) throw new NotFoundException('Driver no encontrado');

    const reserver = await this.reserverRepository.save({
      bus,
      checkIn,
      checkOut,
      driver,
      date,
    });

    return reserver;
  }

  async updateStatus(
    reserverId: number,
    updateStatusDto: UpdateStatusReserverDto,
  ) {
    const { status } = updateStatusDto;

    const findReserver = await this.reserverRepository.findOne({
      where: { reserverId },
    });
    if (!findReserver) throw new NotFoundException('Reserver no encontrado');

    const updatedReserver = await this.reserverRepository.update(reserverId, {
      status,
    });
    return updatedReserver;
  }
}
