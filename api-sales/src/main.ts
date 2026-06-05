import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  Transport,
  MicroserviceOptions,
  RpcException,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        return new RpcException({
          statusCode: 400,
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      },
    }),
  );

  await app.listen();

  console.log(
    `Sales microservice is listening on port ${process.env.REDIS_PORT}`,
  );
}
bootstrap();
