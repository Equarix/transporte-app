import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PublicIaService } from './public-ia.service';

@Controller('public/ia')
export class PublicIaController {
  constructor(private readonly publicIaService: PublicIaService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: Record<string, any>) {
    return this.publicIaService.forwardWebhook(payload);
  }
}
