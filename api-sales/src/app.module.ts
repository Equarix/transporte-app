import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalesModule } from './modules/sales/sales.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsUserModule } from './modules/points-user/points-user.module';
import { PromosModule } from './modules/promos/promos.module';
import { ResenaModule } from './modules/resena/resena.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      options: {
        encrypt: process.env.ENCRYPT === 'true',
        trustServerCertificate: true,
      },
      requestTimeout: 0,
    }),
    SalesModule,
    PointsUserModule,
    PromosModule,
    ResenaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
