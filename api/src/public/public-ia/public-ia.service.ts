import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PublicIaService {
  private readonly logger = new Logger(PublicIaService.name);
  private readonly iaApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.iaApiUrl = this.configService.get<string>('IA_API_URL', 'http://localhost:8000');
  }

  async forwardWebhook(payload: Record<string, any>): Promise<any> {
    const url = `${this.iaApiUrl}/webhook`;
    this.logger.log(`Reenviando webhook de Chatwoot a la API de IA: ${url}`);
    
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error al reenviar webhook a la API de IA: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Error al procesar la integración de IA',
      );
    }
  }

  async getTracking(reserverId: string): Promise<any> {
    const url = `${this.iaApiUrl}/tracking/${reserverId}`;
    this.logger.log(`Obteniendo rastreo público de IA para: ${reserverId}`);
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error al obtener rastreo de IA: ${error.message}`);
      throw new InternalServerErrorException('Error al obtener datos de rastreo');
    }
  }

  async simulateWhatsapp(payload: Record<string, any>): Promise<any> {
    const url = `${this.iaApiUrl}/alerts/whatsapp`;
    this.logger.log(`Simulando alerta de whatsapp pública de IA`);
    try {
      const response = await firstValueFrom(this.httpService.post(url, payload));
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error al simular alerta de whatsapp de IA: ${error.message}`);
      throw new InternalServerErrorException('Error al simular alerta de whatsapp');
    }
  }
}
