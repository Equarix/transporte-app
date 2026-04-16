import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { TypeUser } from './enum/type-user.enum';
import { CreateUserDtoAdmin } from './dto/create-user-admin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async getProfile(userId: number) {
    const profile = await this.profileRepository.findOne({
      where: {
        user: {
          userId,
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async getDrivers() {
    const drivers = await this.profileRepository.find({
      where: {
        typeUser: TypeUser.DRIVER,
        isActive: true,
      },
    });

    return drivers;
  }

  async createUser(createUserDto: CreateUserDtoAdmin) {
    const user = await this.profileRepository.save(createUserDto);
    return user;
  }
}
