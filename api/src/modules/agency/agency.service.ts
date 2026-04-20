import {
  BadRequestException,
  ConflictException,
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
import { AgencyServiceEntity } from './entities/agency-services.entity';
import { AddUserDto } from './dto/add-user.dto';
import { User } from '../auth/entities/user.entity';
import { UserAgency } from '../auth/entities/user-agency.entity';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @InjectRepository(Galery)
    private galeryRepository: Repository<Galery>,
    @InjectRepository(AgencyServiceEntity)
    private agencyServiceRepository: Repository<AgencyServiceEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAgency)
    private userAgencyRepository: Repository<UserAgency>,
  ) {}

  private createSlug(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD') // separa tildes
      .replace(/[\u0300-\u036f]/g, '') // elimina tildes
      .replace(/[^a-z0-9\s-]/g, '') // quita caracteres raros
      .trim()
      .replace(/\s+/g, '-'); // espacios múltiples → 1 guion
  }

  async create(createAgencyDto: CreateAgencyDto) {
    const { imageId, services, ...rest } = createAgencyDto;
    const galery = await this.galeryRepository.findOne({ where: { imageId } });
    if (!galery) throw new BadRequestException('Galeria no encontrada');
    const slug = this.createSlug(rest.name);

    const agency = this.agencyRepository.create({ ...rest, galery, slug });

    const newAgency = await this.agencyRepository.save(agency);

    const servicesSave = await Promise.all(
      services.map(async (service) => {
        const newService = this.agencyServiceRepository.create({
          ...service,
          agency: newAgency,
        });
        return await this.agencyServiceRepository.save(newService);
      }),
    );

    return {
      ...newAgency,
      services: servicesSave,
    };
  }

  async findAll(params: PaginateDto) {
    const { page, limit } = params;
    const [agency, total] = await this.agencyRepository.findAndCount({
      relations: {
        galery: true,
        services: true,
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

  async findAllAgency() {
    const agency = await this.agencyRepository.find({
      where: {
        status: true,
      },
      relations: {
        galery: true,
      },
    });
    return agency;
  }

  async findOne(id: number) {
    const agency = await this.agencyRepository.findOne({
      where: { agencyId: id },
      relations: {
        galery: true,
        services: true,
      },
    });
    if (!agency) throw new NotFoundException('Agencia no encontrada');
    return agency;
  }

  async update(id: number, updateAgencyDto: UpdateAgencyDto) {
    const { imageId, services, ...rest } = updateAgencyDto;
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

    await this.agencyServiceRepository.delete({ agency: { agencyId: id } });

    await Promise.all(
      services?.map(async (service) => {
        const newService = this.agencyServiceRepository.create({
          ...service,
          agency: agency,
        });
        return await this.agencyServiceRepository.save(newService);
      }) ?? [],
    );

    return { message: 'Agencia Actulizada' };
  }

  async remove(id: number) {
    const agency = await this.agencyRepository.findOneBy({ agencyId: id });
    if (!agency) throw new NotFoundException('Agencia no encontrada');
    await this.agencyRepository.update(id, {
      status: false,
    });

    return { message: 'Agencia eliminada correctamente' };
  }

  async addUser(addUserDto: AddUserDto) {
    const { userId, agencyId } = addUserDto;
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const agency = await this.agencyRepository.findOneBy({ agencyId });
    if (!agency) throw new NotFoundException('Agencia no encontrada');

    const findUserAgency = await this.userAgencyRepository.findOne({
      where: {
        user: {
          userId,
        },
        agency: {
          agencyId,
        },
        status: true,
      },
    });

    if (findUserAgency) {
      throw new ConflictException('El usuario ya esta asignado');
    }

    const userAgency = this.userAgencyRepository.create({
      user,
      agency,
    });
    return this.userAgencyRepository.save(userAgency);
  }

  async removeUser(removeUserDto: AddUserDto) {
    const { userId, agencyId } = removeUserDto;
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const agency = await this.agencyRepository.findOneBy({ agencyId });
    if (!agency) throw new NotFoundException('Agencia no encontrada');
    const userAgency = await this.userAgencyRepository.findOneBy({
      user,
      agency,
    });
    if (!userAgency) throw new NotFoundException('Usuario no encontrado');
    return this.userAgencyRepository.update(userAgency.userAgencyId, {
      status: false,
    });
  }

  async findUsersAgency(agencyId: number) {
    const users = await this.userAgencyRepository.find({
      where: {
        agency: { agencyId },
      },
      relations: {
        user: {
          profile: true,
        },
      },
    });
    return users;
  }
}
