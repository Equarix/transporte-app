import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Galery } from './entities/galery.entity';
@Injectable()
export class GaleryService {
  private path = join(__dirname, '..', '..', '..', 'uploads');

  constructor(
    @InjectRepository(Galery)
    private galeryRepository: Repository<Galery>,
  ) { }

  async create(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;
    await writeFile(join(this.path, fileName), file.buffer);

    const filePath = `/static/${fileName}`;


    const saveGalery = this.galeryRepository.create({
      imageUrl: filePath,
      imageName: fileName,
    });

    await this.galeryRepository.save(saveGalery);

    return saveGalery;
  }

  findAll() {
    return this.galeryRepository.find();
  }
}
