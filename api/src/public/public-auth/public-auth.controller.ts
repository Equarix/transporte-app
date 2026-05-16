import { Body, Controller, Get, Post } from '@nestjs/common';
import { PublicAuthService } from './public-auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from 'src/common/decorator/auth/auth.decorator';

@Controller('public/auth')
export class PublicAuthController {
  constructor(private readonly publicAuthService: PublicAuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.publicAuthService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.publicAuthService.login(loginDto);
  }

  @Auth()
  @Get('revalidate')
  revalidate() {
    return { message: 'Token is valid' };
  }
}
