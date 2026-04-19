import { Module } from '@nestjs/common';
import { PublicAuthService } from './public-auth.service';
import { PublicAuthController } from './public-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { Profile } from 'src/modules/user/entities/profile.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [PublicAuthController],
  providers: [PublicAuthService],
})
export class PublicAuthModule {}
