import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agency } from 'src/modules/agency/entities/agency.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PublicAgencyService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) {}

  getAgency() {
    return this.agencyRepository.find({
      where: {
        status: true,
      },
      relations: {
        galery: true,
      },
    });
  }

  async getDetails(id: number) {
    const findAgency = await this.agencyRepository.findOne({
      where: {
        agencyId: id,
        status: true,
      },
      relations: {
        galery: true,
        services: true,
      },
    });

    if (!findAgency) throw new NotFoundException('Agencia no encontrada');
    return findAgency;
  }
}
