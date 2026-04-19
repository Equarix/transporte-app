import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { Auth } from 'src/common/decorator/auth/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-admin')
  loginAdmin(@Body() loginDto: LoginAdminDto) {
    return this.authService.loginAdmin(loginDto);
  }

  @Auth()
  @Get('revalidate')
  revalidate() {
    return this.authService.revalidate();
  }
}
