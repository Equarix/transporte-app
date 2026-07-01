import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ResenaController } from './resena.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    UserModule,
  ],
  controllers: [ResenaController],
  providers: [],
})
export class ResenaModule {}
