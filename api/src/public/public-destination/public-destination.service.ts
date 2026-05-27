import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Destination } from 'src/modules/destination/entities/destination.entity';
import { Reserver } from 'src/modules/reserver/entities/reserver.entity';
import { StatusReserverEnum } from 'src/modules/reserver/enum/status-reserver.enum';
import { Repository } from 'typeorm';

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
    return this.reserverRepository.find({
      relations: {
        checkIn: true,
        checkOut: true,
      },
      where: {
        status: StatusReserverEnum.CONFIRMED,
      },
    });
  }
}
