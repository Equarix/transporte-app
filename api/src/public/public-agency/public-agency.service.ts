import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agency } from 'src/modules/agency/entities/agency.entity';
import { Reserver } from 'src/modules/reserver/entities/reserver.entity';
import { StatusReserverEnum } from 'src/modules/reserver/enum/status-reserver.enum';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class PublicAgencyService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(Reserver)
    private readonly reserverRepository: Repository<Reserver>,
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

  async getDetails(slug: string) {
    const findAgency = await this.agencyRepository.findOne({
      where: {
        slug,
        status: true,
      },
      relations: {
        galery: true,
        services: true,
      },
    });

    if (!findAgency) throw new NotFoundException('Agencia no encontrada');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservers = await this.reserverRepository.find({
      where: {
        status: StatusReserverEnum.CONFIRMED,
        date: MoreThanOrEqual(today),
        reserverAgencies: {
          agency: {
            agencyId: findAgency.agencyId,
          },
        },
      },
      order: {
        date: 'DESC',
      },
      relations: {
        reserverPriceFloors: true,
        driver: true,
        checkOut: true,
        reserverAgencies: {
          agency: true,
        },
        bus: true,
      },
    });

    return {
      ...findAgency,
      reservers,
    };
  }
}
