import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from '../user/entities/profile.entity';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { RoleEnum } from 'src/common/enum/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { typeDocument, documentNumber, password, ...rest } = registerDto;

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

    const payload = {
      userId: user.userId,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      data: {
        ...user,
        profile: profileData,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { typeDocument, documentNumber, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: {
        typeDocument,
        documentNumber,
      },
      relations: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    const payload = {
      userId: user.userId,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      data: user,
      token,
    };
  }

  async loginAdmin(loginDto: LoginAdminDto) {
    const { documentNumber, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: {
        documentNumber,
        role: RoleEnum.ADMIN,
      },
      relations: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Admin user not found');
    }
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    const payload = {
      userId: user.userId,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      data: user,
      token,
    };
  }

  revalidate() {
    return true;
  }
}
