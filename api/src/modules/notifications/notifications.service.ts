import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { NotificationAlert } from './entities/notification-alert.entity';
import { Profile } from '../user/entities/profile.entity';

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
  isRead?: boolean;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(NotificationAlert)
    private readonly alertRepository: Repository<NotificationAlert>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private interests: UserInterest[] = [];

  async saveInterest(userId: number, interest: Omit<UserInterest, 'userId'>) {
    this.interests = this.interests.filter(
      (item) =>
        !(
          item.userId === userId &&
          item.destinationId === interest.destinationId
        ),
    );
    const newInterest = { userId, ...interest };
    this.interests.push(newInterest);

    await this.generatePersonalizedAlert(userId, interest.destinationId);

    return { success: true, interest: newInterest };
  }

  async getInterests(userId: number) {
    return this.interests.filter((item) => item.userId === userId);
  }

  async getAlerts(userId: number): Promise<NotificationAlert[]> {
    const alerts = await this.alertRepository.find({
      where: { userId },
      order: { sentAt: 'DESC' },
    });

    if (alerts.length === 0) {
      // Create a default initial alert and save it
      const defaultAlert = this.alertRepository.create({
        userId,
        title: '¡Descuento especial de temporada!',
        message:
          'Viaja a Trujillo este fin de semana con un 20% de descuento usando el código TRU20.',
        code: 'TRU20',
        discount: '20% DCTO',
        sentAt: new Date(Date.now() - 3600000 * 2),
        isRead: false,
      });
      await this.alertRepository.save(defaultAlert);
      return [defaultAlert];
    }

    return alerts;
  }

  async simulateWhatsApp(
    userId: number,
    phone: string,
    destinationName: string,
  ) {
    const iaApiUrl =
      this.configService.get<string>('IA_API_URL') || 'http://localhost:8000';

    let pythonMessage = '';
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${iaApiUrl}/alerts/whatsapp`, {
          phone,
          destinationName,
        }),
      );
      pythonMessage = response.data.message;
    } catch (error: any) {
      this.logger.error(
        `Error calling Python IA whatsapp endpoint: ${error.message}`,
      );
      pythonMessage = `¡Hola viajero! Alerta para viajar a ${destinationName}. Código: RUTAS25 (Offline).`;
    }

    const newAlert = this.alertRepository.create({
      userId,
      title: `WhatsApp: Promo ${destinationName}`,
      message: pythonMessage,
      code: 'RUTAS25',
      discount: '25% DCTO',
      sentAt: new Date(),
      isRead: false,
    });

    await this.alertRepository.save(newAlert);

    return {
      success: true,
      recipient: phone,
      message: `¡Alerta de WhatsApp simulada y registrada!`,
      alert: newAlert,
    };
  }

  private async generatePersonalizedAlert(
    userId: number,
    destinationId: number,
  ) {
    const newAlert = this.alertRepository.create({
      userId,
      title: '¡Nueva promo según tus intereses!',
      message: `Hemos detectado tu interés de viaje. Disfruta de S/ 15 de descuento para tu ruta preferida usando el código PROMO15.`,
      code: 'PROMO15',
      discount: 'S/ 15 DCTO',
      sentAt: new Date(),
      isRead: false,
    });
    await this.alertRepository.save(newAlert);
  }

  async sendMassiveAlert(payload: {
    title: string;
    message: string;
    code?: string;
    discount?: string;
  }) {
    const profiles = await this.profileRepository.find();
    const alertsToSave = profiles.map((profile) => {
      const alert = new NotificationAlert();
      alert.userId = profile.userId;
      alert.title = payload.title;
      alert.message = payload.message;
      alert.code = payload.code || '';
      alert.discount = payload.discount || '';
      alert.sentAt = new Date();
      alert.isRead = false;
      return alert;
    });
    await this.alertRepository.save(alertsToSave, { chunk: 100 });
    this.logger.log(
      `Alerta masiva "${payload.title}" enviada a ${profiles.length} usuarios.`,
    );
    return { success: true, count: profiles.length };
  }

  async getAllAlerts(): Promise<NotificationAlert[]> {
    return this.alertRepository.find({
      order: { sentAt: 'DESC' },
      take: 50,
    });
  }
}
