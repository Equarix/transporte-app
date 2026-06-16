import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Destination } from 'src/modules/destination/entities/destination.entity';
import { Reserver } from 'src/modules/reserver/entities/reserver.entity';
import { StatusReserverEnum } from 'src/modules/reserver/enum/status-reserver.enum';
import { In, Repository } from 'typeorm';

@Injectable()
export class PublicDestinationService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,

    @InjectRepository(Reserver)
    private reserverRepository: Repository<Reserver>,
  ) {}

  getDestinations() {
    return this.destinationRepository.find({
      where: {
        status: true,
      },
    });
  }

  async getDestinosConectados() {
    const rawRoutes = await this.reserverRepository
      .createQueryBuilder('reserver')
      .select('MIN(reserver.reserverId)', 'reserverId')
      .where('reserver.status = :status', { status: StatusReserverEnum.CONFIRMED })
      .groupBy('reserver.checkInDestinationId')
      .addGroupBy('reserver.checkOutDestinationId')
      .getRawMany();

    if (rawRoutes.length === 0) return [];

    const ids = rawRoutes.map((r) => r.reserverId);

    return this.reserverRepository.find({
      where: {
        reserverId: In(ids),
      },
      relations: {
        checkIn: true,
        checkOut: true,
      },
    });
  }
}
