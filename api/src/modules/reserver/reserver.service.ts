import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserver } from './entities/reserver.entity';
import { DataSource, Repository, Between } from 'typeorm';
import { Destination } from '../destination/entities/destination.entity';
import { Bus } from '../bus/entities/bus.entity';
import { User } from '../auth/entities/user.entity';
import { CreateReserverDto } from './dto/create-reserver.dto';
import { UpdateStatusReserverDto } from './dto/update-status.dto';
import { GetReserversDto } from './dto/get-reservers.dto';
import { Profile } from '../user/entities/profile.entity';
import { Floor } from '../bus/entities/floor.entity';
import { Agency } from '../agency/entities/agency.entity';
import { ReserverPriceFloor } from './entities/reserver-price-floor.entity';
import { ReserverAgency } from './entities/reserver-angecy.entity';

@Injectable()
export class ReserverService {
  constructor(
    @InjectRepository(Reserver)
    private readonly reserverRepository: Repository<Reserver>,
    @InjectRepository(Profile)
    private readonly userRepository: Repository<Profile>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
    private dataSource: DataSource,
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) {}

  async getAll(paginateDto: GetReserversDto) {
    const { limit, page, status, date, checkInId, checkOutId } = paginateDto;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      where.date = Between(startOfDay, endOfDay);
    }
    if (checkInId) {
      where.checkIn = { destinationId: +checkInId };
    }
    if (checkOutId) {
      where.checkOut = { destinationId: +checkOutId };
    }

    const [data, total] = await this.reserverRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        registerUser: {
          profile: true,
        },
        checkIn: true,
        checkOut: true,
        bus: true,
        driver: true,
        reserverPriceFloors: true,
        reserverAgencies: {
          agency: {
            galery: true,
          },
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

  async create(createDto: CreateReserverDto, userId: number) {
    const {
      busId,
      checkInId,
      checkOutId,
      date,
      driverId,
      reserverPriceFloors,
      reserverAgencies,
      checkOutHour,
    } = createDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
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

      const findUser = await this.userRepository.findOne({
        where: { userId },
      });
      if (!findUser) throw new NotFoundException('User no encontrado');

      const reserver = await queryRunner.manager.save(Reserver, {
        bus,
        checkIn,
        checkOut,
        driver,
        date,
        registerUser: findUser,
        checkOutHour,
      });

      const reserverPricesFloor = await Promise.all(
        reserverPriceFloors.map(async (i) => {
          const findFloor = await this.floorRepository.findOne({
            where: { floorId: i.floorId, bus: { busId } },
          });

          if (!findFloor) throw new NotFoundException('Floor no encontrado');

          const reserverPriceFloor = await queryRunner.manager.save(
            ReserverPriceFloor,
            {
              floor: findFloor,
              price: i.price,
              reserver,
            },
          );

          return reserverPriceFloor;
        }),
      );

      const reserverAgenciesData = await Promise.all(
        reserverAgencies.map(async (i) => {
          const findAgency = await this.agencyRepository.findOne({
            where: { agencyId: i.agencyId },
          });

          if (!findAgency) throw new NotFoundException('Agency no encontrado');

          const reserverAgency = await queryRunner.manager.save(
            ReserverAgency,
            {
              agency: findAgency,
              name: findAgency.name,
              phone: findAgency.phone,
              address: findAgency.address,
              email: '',
              hour: i.hour,
              reserver,
            },
          );

          return reserverAgency;
        }),
      );

      await queryRunner.commitTransaction();

      return {
        ...reserver,
        reserverPricesFloor,
        reserverAgencies: reserverAgenciesData,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
