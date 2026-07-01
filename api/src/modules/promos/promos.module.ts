import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PromosController } from './promos.controller';
import { PromosGatewayService } from './promos.service';
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
  ],
  controllers: [PromosController],
  providers: [PromosGatewayService],
})
export class PromosGatewayModule {}
