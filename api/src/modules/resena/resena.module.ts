import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ResenaController } from './resena.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          port: parseInt(process.env.REDIS_PORT ?? '6379'),
        },
      },
    ]),
    UserModule,
  ],
  controllers: [ResenaController],
  providers: [],
})
export class ResenaModule {}
