import { Injectable } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './entities/experiences.entity';
import { Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { PaginateDto } from 'src/common/utils/paginate.dto';
import { Galery } from '../galery/entities/galery.entity';

@Injectable()
export class DestinationService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    @InjectRepository(Galery)
    private galeryRepository: Repository<Galery>,
  ) {}

  async create(createDestinationDto: CreateDestinationDto) {
    const { experiences, imageId, ...rest } = createDestinationDto;

    const galery = await this.galeryRepository.findOne({
      where: { imageId },
    });

    if (!galery) {
      throw new Error('Galery not found');
    }

    const findGalery = await Promise.all(
      experiences.map(async (e) => {
        const galery = await this.galeryRepository.findOne({
          where: { imageId: e.imageId },
        });

        if (!galery) {
          throw new Error('Galery not found');
        }

        return galery;
      }),
    );

    const destination = this.destinationRepository.create({
      ...rest,
      galery,
    });

    await this.destinationRepository.save(destination);

    const experienceEntities = await Promise.all(
      experiences.map(async (ex) => {
        const galery = findGalery.find((g) => g.imageId === ex.imageId);

        const experienceEntity = this.experienceRepository.create({
          ...ex,
          destination,
          galery,
        });
        await this.experienceRepository.save(experienceEntity);

        const { destination: dest, ...experience } = experienceEntity;
        return experience;
      }),
    );

    return {
      ...destination,
      experiences: experienceEntities,
    };
  }

  async findAll(paginate: PaginateDto) {
    const { page, limit } = paginate;

    const destinations = await this.destinationRepository.find({
      relations: {
        experiences: {
          galery: true,
        },
        galery: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const count = await this.destinationRepository.count();

    return {
      data: destinations,
      metadata: {
        totalItems: count,
        itemCount: destinations.length,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    const destination = await this.destinationRepository.findOne({
      where: { destinationId: id },
      relations: {
        experiences: {
          galery: true,
        },
        galery: true,
      },
    });

    return destination;
  }

  async update(id: number, updateDestinationDto: UpdateDestinationDto) {
    const findDestination = await this.destinationRepository.findOne({
      where: { destinationId: id },
    });

    if (!findDestination) {
      throw new Error('Destination not found');
    }

    const { experiences, imageId, ...rest } = updateDestinationDto;

    const galery = await this.galeryRepository.findOne({
      where: { imageId },
    });

    if (!galery) {
      throw new Error('Galery not found');
    }

    const findGalery = await Promise.all(
      experiences?.map(async (e) => {
        const galery = await this.galeryRepository.findOne({
          where: { imageId: e.imageId },
        });

        if (!galery) {
          throw new Error('Galery not found');
        }

        return galery;
      }) || [],
    );

    const destination = this.destinationRepository.create({
      destinationId: id,
      ...rest,
      galery,
    });

    await this.destinationRepository.save(destination);

    await this.experienceRepository.delete({
      destination: { destinationId: id },
    });

    const experienceEntities = await Promise.all(
      experiences?.map(async (ex) => {
        const galery = findGalery.find((g) => g.imageId === ex.imageId);

        const experienceEntity = this.experienceRepository.create({
          ...ex,
          destination,
          galery,
        });
        await this.experienceRepository.save(experienceEntity);

        const { destination: dest, ...experience } = experienceEntity;
        return experience;
      }) || [],
    );

    return {
      ...destination,
      experiences: experienceEntities,
    };
  }

  async remove(id: number) {
    const findDestination = await this.destinationRepository.findOne({
      where: { destinationId: id },
    });

    if (!findDestination) {
      throw new Error('Destination not found');
    }

    await this.destinationRepository.update(id, {
      status: false,
    });

    return true;
  }
}
