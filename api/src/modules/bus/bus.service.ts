import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { DataSource, Repository } from 'typeorm';
import { Floor } from './entities/floor.entity';
import { Seat } from './entities/seat.entity';
import { PaginateDto } from 'src/common/utils/paginate.dto';

@Injectable()
export class BusService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
  ) {}

  async create(createBusDto: CreateBusDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { floors, ...rest } = createBusDto;
      const busSave = await queryRunner.manager.save(Bus, rest);

      const floorsSave = await Promise.all(
        floors.map(async (floor) => {
          const { seats, ...restFloor } = floor;

          const { bus, ...saveFloor } = await queryRunner.manager.save(Floor, {
            ...restFloor,
            bus: busSave,
          });

          const seatsSave = await Promise.all(
            seats.map(async (seat) => {
              const { floor: floorSave, ...saveSeat } =
                await queryRunner.manager.save(Seat, {
                  ...seat,
                  floor: saveFloor,
                });
              return saveSeat;
            }),
          );
          return {
            ...saveFloor,
            seat: seatsSave,
          };
        }),
      );

      await queryRunner.commitTransaction();
      return {
        ...busSave,
        floors: floorsSave,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: PaginateDto) {
    const { limit, page } = params;

    const [data, total] = await this.busRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        floors: {
          seats: true,
        },
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

  async findOne(id: number) {
    const bus = await this.busRepository.findOne({
      where: { busId: id },
      relations: {
        floors: {
          seats: true,
        },
      },
    });
    if (!bus) throw new NotFoundException('Bus no encontrado');
    return bus;
  }

  async update(id: number, updateBusDto: UpdateBusDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { floors, ...rest } = updateBusDto;

    try {
      const bus = await queryRunner.manager.findOne(Bus, {
        where: { busId: id },
      });
      if (!bus) throw new NotFoundException('Bus no encontrado');

      const busUpdate = await queryRunner.manager.update(Bus, id, rest);

      const floorsUpdate = await Promise.all(
        floors.map(async (floor) => {
          const { seats, floorId, ...restFloor } = floor;

          const floorUpdate = await queryRunner.manager.update(
            Floor,
            floorId,
            restFloor,
          );
          const seatsUpdate = await Promise.all(
            seats.map(async (seat) => {
              const { seatId, ...restSeat } = seat;

              const seatUpdate = await queryRunner.manager.update(
                Seat,
                seatId,
                restSeat,
              );
              return seatUpdate;
            }),
          );
          return {
            ...floorUpdate,
            seats: seatsUpdate,
          };
        }),
      );

      await queryRunner.commitTransaction();
      return {
        ...busUpdate,
        floors: floorsUpdate,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const bus = await this.busRepository.findOne({
      where: { busId: id },
    });
    if (!bus) throw new NotFoundException('Bus no encontrado');
    const updatedBus = await this.busRepository.update(id, { status: false });
    return updatedBus;
  }

  async findAllBus() {
    const buses = await this.busRepository.find({
      where: {
        status: true,
      },
      relations: {
        floors: true,
      },
    });
    return buses;
  }
}
