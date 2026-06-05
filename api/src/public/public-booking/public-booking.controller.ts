import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PublicBookingService } from './public-booking.service';
import { QueryDestinationDto } from './dto/query-destination.dto';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { CreateSaleDto } from '@transporte/dtos';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/common/decorator/user/user.decorator';

@Controller('public/booking')
export class PublicBookingController implements OnModuleInit {
  constructor(
    private readonly publicBookingService: PublicBookingService,
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.paymentClient.connect();
  }

  @Get('/destinations')
  async getDestinations(@Query() query: QueryDestinationDto) {
    return this.publicBookingService.getDestinations(query);
  }

  @Get('/bus/:idReservation')
  async getBus(@Param('idReservation') idReservation: string) {
    return this.publicBookingService.getBus(+idReservation);
  }

  @Auth()
  @Post('/pay')
  async pay(@Body() data: CreateSaleDto, @User('userId') userId: number) {
    return this.paymentClient.send('createSale', { ...data, userId: userId });
  }
}
