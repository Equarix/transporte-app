import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PromosController } from './promos.controller';
import { PromosGatewayService } from './promos.service';

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
  ],
  controllers: [PromosController],
  providers: [PromosGatewayService],
})
export class PromosGatewayModule {}
