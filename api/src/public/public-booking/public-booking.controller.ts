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

  @Get('/available-dates')
  async getAvailableDates(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
  ) {
    return this.publicBookingService.getAvailableDates(origin, destination);
  }

  @Auth()
  @Post('/pay')
  async pay(@Body() data: CreateSaleDto, @User('userId') userId: number) {
    // Verificar si el usuario comprador con el documentNumber existe en la base de datos
    const dbUser = await this.publicBookingService.checkUserByDocument(
      data.payer.documentType,
      data.payer.documentNumber
    );
    
    // Si es un bot o si coincide con el userId autenticado, usar ese userId.
    // De lo contrario, usar el userId del comprador encontrado por su documentNumber.
    const targetUserId = dbUser ? dbUser.userId : userId;
    return this.paymentClient.send('createSale', { ...data, userId: targetUserId });
  }

  @Auth()
  @Post('/approve/:saleId')
  async approveSale(
    @Param('saleId') saleId: string,
    @User('userId') userId: number,
  ) {
    return firstValueFrom(
      this.paymentClient.send('approveSale', +saleId),
    );
  }
}

