import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DestinationModule } from './modules/destination/destination.module';
import { GaleryModule } from './modules/galery/galery.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AgencyModule } from './modules/agency/agency.module';
import { BusModule } from './modules/bus/bus.module';
import { FloorModule } from './modules/floor/floor.module';
import { SeatModule } from './modules/seat/seat.module';
import { ReserverModule } from './modules/reserver/reserver.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      options: {
        encrypt: process.env.ENCRYPT === 'true',
        trustServerCertificate: true,
      },
      requestTimeout: 0,
    }),
    AuthModule,
    UserModule,
    DestinationModule,
    GaleryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/api/static',
    }),
    AgencyModule,
    BusModule,
    FloorModule,
    SeatModule,
    ReserverModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
