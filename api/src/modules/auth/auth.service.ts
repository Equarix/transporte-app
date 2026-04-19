import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from '../user/entities/profile.entity';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { RoleEnum } from 'src/common/enum/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  async loginAdmin(loginDto: LoginAdminDto) {
    const { documentNumber, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: {
        documentNumber,
      },
      relations: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (user.role === RoleEnum.USER) {
      throw new UnauthorizedException('user not authorized');
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
