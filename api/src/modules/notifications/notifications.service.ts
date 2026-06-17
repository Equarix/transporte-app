import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface UserInterest {
  userId: number;
  originId: number;
  destinationId: number;
  travelDate: string;
}

export interface PromoAlert {
  alertId: number;
  title: string;
  message: string;
  code: string;
  discount: string;
  sentAt: Date;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  
  private interests: UserInterest[] = [];
  private alerts: Map<number, PromoAlert[]> = new Map();
  private alertCounter = 1;

  async saveInterest(userId: number, interest: Omit<UserInterest, 'userId'>) {
    this.interests = this.interests.filter(
      (item) => !(item.userId === userId && item.destinationId === interest.destinationId)
    );
    const newInterest = { userId, ...interest };
    this.interests.push(newInterest);
    
    await this.generatePersonalizedAlert(userId, interest.destinationId);
    
    return { success: true, interest: newInterest };
  }

  async getInterests(userId: number) {
    return this.interests.filter((item) => item.userId === userId);
  }

  async getAlerts(userId: number): Promise<PromoAlert[]> {
    if (!this.alerts.has(userId)) {
      this.alerts.set(userId, [
        {
          alertId: this.alertCounter++,
          title: '¡Descuento especial de temporada!',
          message: 'Viaja a Trujillo este fin de semana con un 20% de descuento usando el código TRU20.',
          code: 'TRU20',
          discount: '20% DCTO',
          sentAt: new Date(Date.now() - 3600000 * 2),
        }
      ]);
    }
    return this.alerts.get(userId) || [];
  }

  async simulateWhatsApp(userId: number, phone: string, destinationName: string) {
    const iaApiUrl = this.configService.get<string>('IA_API_URL') || 'http://localhost:8000';
    
    let pythonMessage = '';
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${iaApiUrl}/alerts/whatsapp`, {
          phone,
          destinationName,
        })
      );
      pythonMessage = response.data.message;
    } catch (error: any) {
      this.logger.error(`Error calling Python IA whatsapp endpoint: ${error.message}`);
      pythonMessage = `¡Hola viajero! Alerta para viajar a ${destinationName}. Código: RUTAS25 (Offline).`;
    }
    
    const userAlerts = await this.getAlerts(userId);
    const newAlert: PromoAlert = {
      alertId: this.alertCounter++,
      title: `WhatsApp: Promo ${destinationName}`,
      message: pythonMessage,
      code: 'RUTAS25',
      discount: '25% DCTO',
      sentAt: new Date(),
    };
    userAlerts.unshift(newAlert);
    this.alerts.set(userId, userAlerts);

    return {
      success: true,
      recipient: phone,
      message: `¡Alerta de WhatsApp simulada y registrada!`,
      alert: newAlert
    };
  }

  private async generatePersonalizedAlert(userId: number, destinationId: number) {
    const userAlerts = await this.getAlerts(userId);
    const newAlert: PromoAlert = {
      alertId: this.alertCounter++,
      title: '¡Nueva promo según tus intereses!',
      message: `Hemos detectado tu interés de viaje. Disfruta de S/ 15 de descuento para tu ruta preferida usando el código PROMO15.`,
      code: 'PROMO15',
      discount: 'S/ 15 DCTO',
      sentAt: new Date(),
    };
    userAlerts.unshift(newAlert);
    this.alerts.set(userId, userAlerts);
  }
}
