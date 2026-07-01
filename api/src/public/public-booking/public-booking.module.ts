import { Module } from '@nestjs/common';
import { PublicBookingService } from './public-booking.service';
import { PublicBookingController } from './public-booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from 'src/modules/destination/entities/destination.entity';
import { Reserver } from 'src/modules/reserver/entities/reserver.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Destination, Reserver, User]),
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
  controllers: [PublicBookingController],
  providers: [PublicBookingService],
})
export class PublicBookingModule {}
