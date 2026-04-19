import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { User } from 'src/common/decorator/user/user.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { CreateUserDtoAdmin } from './dto/create-user-admin.dto';
import { QueryUserDto } from './dto/query-user.dto';

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

  @Auth([RoleEnum.ADMIN])
  @Get()
  getUsers(@Query() params: QueryUserDto) {
    return this.userService.getUsers(params);
  }

  @Auth([RoleEnum.ADMIN])
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @Auth([RoleEnum.ADMIN])
  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: CreateUserDtoAdmin,
  ) {
    return this.userService.update(+userId, updateUserDto);
  }
}
