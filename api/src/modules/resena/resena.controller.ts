import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { User } from 'src/common/decorator/user/user.decorator';
import { RoleEnum } from 'src/common/enum/role.enum';
import { CreateResenaGatewayDto } from './dto/create-resena.dto';
import { UserService } from '../user/user.service';

@Controller('resenas')
export class ResenaController {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientProxy,
    private readonly userService: UserService,
  ) {}

  @Auth([RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SELLER])
  @Post()
  create(
    @Body() createResenaDto: CreateResenaGatewayDto,
    @User('userId') userId: number,
  ) {
    return this.paymentClient.send('createResena', {
      ...createResenaDto,
      userId,
    });
  }

  @Auth([RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SELLER])
  @Get('pending')
  async findPending(@User('userId') userId: number) {
    const sales = await firstValueFrom(
      this.paymentClient.send('findUserSales', userId),
    );
    const enriched = await this.userService.enrichTickets(sales);

    const now = new Date();
    const pastTickets = enriched.filter((ticket: any) => {
      const tripDate = ticket.reserver?.date
        ? new Date(ticket.reserver.date)
        : new Date(ticket.createdAt);
      return (
        tripDate < now &&
        ticket.status.toLowerCase() !== 'cancelado' &&
        ticket.reserver?.status.toLowerCase() !== 'cancelled'
      );
    });

    if (pastTickets.length === 0) {
      return [];
    }

    const saleIds = pastTickets.map((t: any) => t.saleId);
    const reviewedSaleIds = await firstValueFrom(
      this.paymentClient.send<number[]>('findReviewedSaleIds', {
        userId,
        saleIds,
      }),
    );

    const pending = pastTickets.filter(
      (t: any) => !reviewedSaleIds.includes(t.saleId),
    );

    return pending;
  }

  @Auth([RoleEnum.ADMIN])
  @Get()
  async findAll() {
    const reviews = await firstValueFrom(
      this.paymentClient.send('findAllResena', {}),
    );
    return reviews;
  }

  @Auth([RoleEnum.ADMIN])
  @Get('metrics')
  async getMetrics() {
    const metrics = await firstValueFrom(
      this.paymentClient.send('getResenaMetrics', {}),
    );
    return metrics;
  }

  @Auth([RoleEnum.ADMIN])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await firstValueFrom(
      this.paymentClient.send('removeResena', +id),
    );
    return result;
  }
}
