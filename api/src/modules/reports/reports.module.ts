import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Destination } from '../destination/entities/destination.entity';
import { Bus } from '../bus/entities/bus.entity';
import { Profile } from '../user/entities/profile.entity';
import { User } from '../auth/entities/user.entity';
import { UserAgency } from '../auth/entities/user-agency.entity';
import { Agency } from '../agency/entities/agency.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      Destination,
      Bus,
      Profile,
      User,
      UserAgency,
      Agency,
    ]),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          username: process.env.REDIS_USERNAME,
          password: process.env.REDIS_PASSWORD,
        },
      },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
