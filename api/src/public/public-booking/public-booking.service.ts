import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Destination } from 'src/modules/destination/entities/destination.entity';
import { Reserver } from 'src/modules/reserver/entities/reserver.entity';
import { Between, DataSource, In, Repository } from 'typeorm';
import { QueryDestinationDto } from './dto/query-destination.dto';
import { StatusReserverEnum } from 'src/modules/reserver/enum/status-reserver.enum';

@Injectable()
export class PublicBookingService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    @InjectRepository(Reserver)
    private reserverRepository: Repository<Reserver>,
    private datasource: DataSource,
  ) {}

  async getDestinations(query: QueryDestinationDto) {
    const { origin, destination, checkIn } = query;

    const destinations = await this.destinationRepository.find({
      where: {
        slug: In([origin, destination]),
        status: true,
      },
    });

    const originDestination = destinations.find((d) => d.slug === origin);
    const destinationDestination = destinations.find(
      (d) => d.slug === destination,
    );

    if (!originDestination || !destinationDestination) {
      throw new NotFoundException('Origin or destination not found');
    }

    const checkInDate = new Date(checkIn);
    const startDate = new Date(checkInDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(checkInDate);
    endDate.setHours(23, 59, 59, 999);

    const reserver = await this.reserverRepository.find({
      where: {
        checkIn: originDestination,
        checkOut: destinationDestination,
        date: Between(startDate, endDate),
        status: StatusReserverEnum.CONFIRMED,
      },
      relations: {
        reserverAgencies: true,
        reserverPriceFloors: true,
      },
    });

    if (reserver.length === 0) {
      throw new NotFoundException(
        'No confirmed reservations found for the specified criteria',
      );
    }

    return {
      origin: originDestination,
      destination: destinationDestination,
      reservations: reserver.map((r) => ({
        ...r,
        freeSeats: 12,
      })),
    };
  }

  async getBus(idReservation: number) {
    const reserver = await this.reserverRepository.findOne({
      where: {
        reserverId: idReservation,
      },
      relations: {
        bus: {
          floors: {
            seats: true,
          },
        },
      },
    });

    if (!reserver) {
      throw new NotFoundException('Reservation not found');
    }

    return reserver.bus;
  }
}
