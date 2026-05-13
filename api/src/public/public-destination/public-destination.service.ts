import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Destination } from 'src/modules/destination/entities/destination.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PublicDestinationService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
  ) {}

  getDestinations() {
    return this.destinationRepository.find({
      where: {
        status: true,
      },
    });
  }
}
