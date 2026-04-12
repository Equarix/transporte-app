import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { Repository } from 'typeorm';
import { Galery } from '../galery/entities/galery.entity';
import { PaginateDto } from 'src/common/utils/paginate.dto';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @InjectRepository(Galery)
    private galeryRepository: Repository<Galery>,
  ) {}

  async create(createAgencyDto: CreateAgencyDto) {
    const { imageId, ...rest } = createAgencyDto;
    const galery = await this.galeryRepository.findOne({ where: { imageId } });
    if (!galery) throw new BadRequestException('Galeria no encontrada');
    const agency = this.agencyRepository.create({ ...rest, galery });
    return await this.agencyRepository.save(agency);
  }

  async findAll(params: PaginateDto) {
    const { page, limit } = params;
    const [agency, total] = await this.agencyRepository.findAndCount({
      relations: {
        galery: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: agency,
      metadata: {
        totalItems: total,
        itemCount: agency.length,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    const agency = await this.agencyRepository.findOne({
      where: { agencyId: id },
      relations: {
        galery: true,
      },
    });
    if (!agency) throw new NotFoundException('Agencia no encontrada');
    return agency;
  }

  async update(id: number, updateAgencyDto: UpdateAgencyDto) {
    const { imageId, ...rest } = updateAgencyDto;
    const agency = await this.agencyRepository.findOneBy({ agencyId: id });
    if (!agency) throw new NotFoundException('Agencia no encontrada');
    const galery = await this.galeryRepository.findOne({
      where: { imageId },
    });
    if (!galery) throw new BadRequestException('Galeria no encontrada');
    await this.agencyRepository.update(id, {
      ...rest,
      galery,
    });
  }

  async remove(id: number) {
    const agency = await this.agencyRepository.findOneBy({ agencyId: id });
    if (!agency) throw new NotFoundException('Agencia no encontrada');
    await this.agencyRepository.update(id, {
      status: false,
    });

    return { message: 'Agencia eliminada correctamente' };
  }
}
