import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Profile } from './entities/profile.entity';
import { User } from '../auth/entities/user.entity';
import { Reserver } from '../reserver/entities/reserver.entity';
import { Destination } from '../destination/entities/destination.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, User, Reserver, Destination]),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      },
    ]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
