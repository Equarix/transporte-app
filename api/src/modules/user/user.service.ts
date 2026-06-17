import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Profile } from './entities/profile.entity';
import { In, Like, Not, Repository } from 'typeorm';
import { TypeUser } from './enum/type-user.enum';
import { Reserver } from '../reserver/entities/reserver.entity';
import { Destination } from '../destination/entities/destination.entity';
import { CreateUserDtoAdmin } from './dto/create-user-admin.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from '../auth/entities/user.entity';
import { hash } from 'bcryptjs';
import { RoleEnum } from 'src/common/enum/role.enum';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError, throwError } from 'rxjs';

export interface SaleDetailFromMicroservice {
  saleDetailId: number;
  busId: number;
  seatId: number;
  floor: number;
  row: number;
  column: number;
  amount: number;
  documentNumber: string;
  documentType: string;
  name: string;
  typeSeat: string;
}

export interface SalePayerFromMicroservice {
  salePayerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  typeDocument: string;
  documentNumber: string;
}

export interface SaleFromMicroservice {
  saleId: number;
  createdAt: Date;
  userId: number;
  status: string;
  purchaseFrom: string;
  fromDestinationId: number;
  toDestinationId: number;
  agencyId?: number;
  reserverId: number;
  saleDetails: SaleDetailFromMicroservice[];
  salePayer?: SalePayerFromMicroservice;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Reserver) private reserverRepository: Repository<Reserver>,
    @InjectRepository(Destination) private destinationRepository: Repository<Destination>,
    private httpService: HttpService,
    private configService: ConfigService,
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
  ) {
    this.logger = new Logger(UserService.name);
  }

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

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
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

    const updatedProfile = this.profileRepository.merge(profile, updateProfileDto);
    await this.profileRepository.save(updatedProfile);

    return updatedProfile;
  }

  async getPendingTickets(sales: SaleFromMicroservice[]) {
    return this.enrichTickets(sales);
  }

  async enrichTickets(sales: SaleFromMicroservice[]) {
    if (!sales || sales.length === 0) return [];

    const reserverIds = [...new Set(sales.map(s => s.reserverId).filter(Boolean))];
    const destIds = [...new Set(sales.flatMap(s => [s.fromDestinationId, s.toDestinationId]).filter(Boolean))];

    const reservers = reserverIds.length > 0 
      ? await this.reserverRepository.find({
          where: { reserverId: In(reserverIds) },
          relations: {
            bus: true,
            driver: true,
          }
        })
      : [];

    const destinations = destIds.length > 0
      ? await this.destinationRepository.find({
          where: { destinationId: In(destIds) }
        })
      : [];

    const reserverMap = new Map(reservers.map(r => [r.reserverId, r]));
    const destMap = new Map(destinations.map(d => [d.destinationId, d]));

    return sales.map(sale => {
      const reserver = reserverMap.get(sale.reserverId);
      const origin = destMap.get(sale.fromDestinationId);
      const destination = destMap.get(sale.toDestinationId);

      return {
        ...sale,
        reserver: reserver ? {
          reserverId: reserver.reserverId,
          date: reserver.date,
          checkOutHour: reserver.checkOutHour,
          status: reserver.status,
          bus: reserver.bus ? {
            busId: reserver.bus.busId,
            plate: reserver.bus.plate,
          } : null,
          driver: reserver.driver ? {
            userId: reserver.driver.userId,
            firstName: reserver.driver.firstName,
            lastName: reserver.driver.lastName,
          } : null,
        } : null,
        origin,
        destination,
      };
    });
  }

  async getRecommendations(userId: number): Promise<any[]> {
    this.logger.log(`Fetching recommendations for user ${userId}`);

    // Get user's past tickets to determine travel history
    const pastSales = await firstValueFrom(
      this.paymentClient.send('findUserSales', userId),
    ).catch(error => {
      this.logger.error(`Failed to fetch user sales: ${error.message}`);
      return []; // Return empty array if we can't fetch sales
    });

    if (!pastSales || pastSales.length === 0) {
      this.logger.log(`No past sales found for user ${userId}, returning empty recommendations`);
      return [];
    }

    // Format past trips for the IA service
    const pastTrips = pastSales.map(sale => ({
      fromDestinationId: sale.fromDestinationId,
      toDestinationId: sale.toDestinationId,
      // We could add date if needed for more sophisticated recommendations
      date: sale.createdAt?.toISOString().split('T')[0] || ''
    }));

    // Call IA service for recommendations
    try {
      const iaApiUrl = this.configService.get<string>('IA_API_URL') || 'http://localhost:8000';
      const internalKey = this.configService.get<string>('IA_INTERNAL_KEY') || 'internal-secret-key-change-in-production';

      const response = await firstValueFrom(
        this.httpService.post(
          `${iaApiUrl}/recommendations`,
          { past_trips: pastTrips, limit: 5 },
          { headers: { 'x_internal_key': internalKey } }
        ).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`Error calling IA service: ${error.message}`);
            return throwError(() => error);
          })
        )
      );

      return response.data.data || [];
    } catch (error) {
      this.logger.error(`Failed to get recommendations from IA service: ${error.message}`);
      // Return empty array as fallback
      return [];
    }
  }
}
