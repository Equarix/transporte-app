import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { User } from 'src/common/decorator/user/user.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { CreateUserDtoAdmin } from './dto/create-user-admin.dto';

@Auth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@User('userId') userId: number) {
    return this.userService.getProfile(userId);
  }

  @Auth([RoleEnum.ADMIN])
  @Get('drivers')
  getDrivers() {
    return this.userService.getDrivers();
  }

  @Auth([RoleEnum.ADMIN])
  @Post()
  create(@Body() createUserDto: CreateUserDtoAdmin) {
    return this.userService.createUser(createUserDto);
  }
}
