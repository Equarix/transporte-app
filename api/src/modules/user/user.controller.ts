import {
  Body,
  Controller,
  Get,
  Inject,
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
import { UpdateProfileDto } from './dto/update-profile.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Auth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientProxy,
  ) {}

  @Get('profile')
  getProfile(@User('userId') userId: number) {
    return this.userService.getProfile(userId);
  }

  @Get('points')
  async getPoints(@User('userId') userId: number) {
    return firstValueFrom(this.paymentClient.send('getUserPoints', userId));
  }

  @Post('points/redeem')
  async redeemPoints(
    @User('userId') userId: number,
    @Body() body: { rewardId: string; points: number },
  ) {
    return firstValueFrom(
      this.paymentClient.send('redeemPoints', {
        userId,
        rewardId: body.rewardId,
        points: body.points,
      }),
    );
  }

  @Get('tickets')
  async getTickets(@User('userId') userId: number) {
    const sales = await firstValueFrom(
      this.paymentClient.send('findUserSales', userId),
    );
    return this.userService.enrichTickets(sales);
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

  @Patch('profile')
  updateProfile(
    @User('userId') userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, updateProfileDto);
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
