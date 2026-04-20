import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Like, Not, Repository } from 'typeorm';
import { TypeUser } from './enum/type-user.enum';
import { CreateUserDtoAdmin } from './dto/create-user-admin.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from '../auth/entities/user.entity';
import { hash } from 'bcryptjs';
import { RoleEnum } from 'src/common/enum/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: number) {
    const profile = await this.profileRepository.findOne({
      where: {
        user: {
          userId,
        },
      },
      relations: {
        user: true,
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

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        userId: id,
      },
      relations: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDtoAdmin) {
    const { typeDocument, documentNumber, password, role, ...rest } =
      createUserDto;

    const findUser = await this.userRepository.findOne({
      where: {
        typeDocument,
        documentNumber,
      },
    });

    if (findUser) {
      throw new ConflictException('User already exists');
    }

    const hashPassword = await hash(password, 10);

    const user = this.userRepository.create({
      typeDocument,
      documentNumber,
      password: hashPassword,
      role,
    });
    await this.userRepository.save(user);

    const profile = this.profileRepository.create({
      ...rest,
      typeDocument,
      documentNumber,
      user,
    });

    await this.profileRepository.save(profile);

    const { user: _, ...profileData } = profile;

    return {
      ...user,
      profile: profileData,
    };
  }

  async getUsers(params: QueryUserDto) {
    const { page, limit, documentNumber } = params;
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        role: Not(RoleEnum.USER),
        ...(documentNumber && { documentNumber: Like(`%${documentNumber}%`) }),
      },
      relations: {
        profile: true,
      },
    });
    return {
      data: users,
      metadata: {
        totalItems: total,
        itemCount: users.length,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async update(id: number, updateUserDto: CreateUserDtoAdmin) {
    const user = await this.userRepository.findOne({
      where: {
        userId: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.profileRepository.findOne({
      where: {
        user: {
          userId: id,
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const { typeDocument, documentNumber, password, role, ...rest } =
      updateUserDto;

    const hashPassword = await hash(password, 10);

    const updatedUser = this.userRepository.merge(user, {
      typeDocument,
      documentNumber,
      password: hashPassword,
      role,
    });
    await this.userRepository.save(updatedUser);

    const updatedProfile = this.profileRepository.merge(profile, {
      ...rest,
      typeDocument,
      documentNumber,
    });
    await this.profileRepository.save(updatedProfile);

    return {
      ...updatedUser,
      profile: updatedProfile,
    };
  }
}
