import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserver } from '../reserver/entities/reserver.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Reserver)
    private readonly reserverRepository: Repository<Reserver>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getTracking(reserverId: number) {
    const trip = await this.reserverRepository.findOne({
      where: { reserverId },
      relations: {
        checkIn: true,
        checkOut: true,
        driver: true,
        bus: true,
      },
    });

    if (!trip) {
      throw new NotFoundException('Viaje no encontrado');
    }

    const iaApiUrl = this.configService.get<string>('IA_API_URL') || 'http://localhost:8000';

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${iaApiUrl}/tracking/${reserverId}`)
      );
      
      const pyData = response.data;
      return {
        reserverId: trip.reserverId,
        status: trip.status,
        date: trip.date,
        checkOutHour: trip.checkOutHour,
        bus: {
          busId: trip.bus?.busId || 0,
          plate: trip.bus?.plate || pyData.bus.plate,
          model: trip.bus?.model || pyData.bus.model,
          capacity: trip.bus?.capacity || pyData.bus.capacity,
          type: trip.bus?.type || pyData.bus.type,
        },
        driver: {
          userId: trip.driver?.userId || 0,
          firstName: trip.driver?.firstName || pyData.driver.name.split(' ')[0],
          lastName: trip.driver?.lastName || pyData.driver.name.split(' ')[1] || '',
        },
        origin: {
          destinationId: trip.checkIn?.destinationId || pyData.origin.destinationId || 1,
          name: trip.checkIn?.name || pyData.origin.name,
          shortDescription: trip.checkIn?.shortDescription || '',
          lat: pyData.origin.lat,
          lng: pyData.origin.lng,
        },
        destination: {
          destinationId: trip.checkOut?.destinationId || pyData.destination.destinationId || 2,
          name: trip.checkOut?.name || pyData.destination.name,
          shortDescription: trip.checkOut?.shortDescription || '',
          lat: pyData.destination.lat,
          lng: pyData.destination.lng,
        },
        currentLocation: {
          lat: pyData.currentLocation.lat,
          lng: pyData.currentLocation.lng,
          progressPercentage: pyData.currentLocation.progressPercentage,
        },
        eta: {
          minutesRemaining: pyData.eta.minutesRemaining,
          estimatedTimeOfArrival: new Date(Date.now() + pyData.eta.minutesRemaining * 60000).toISOString(),
        },
        servicesAvailable: [
          { name: 'WiFi Gratis', icon: 'wifi', available: true },
          { name: 'Tomacorriente / USB', icon: 'usb', available: true },
          { name: 'Aire Acondicionado', icon: 'air', available: true },
          { name: 'Snack a bordo', icon: 'food', available: true },
          { name: 'Asientos Reclinables 160°', icon: 'seat', available: true },
        ]
      };
    } catch (error: any) {
      const originLat = parseFloat(trip.checkIn?.lat || '-12.046374');
      const originLng = parseFloat(trip.checkIn?.lng || '-77.042793');
      const destLat = parseFloat(trip.checkOut?.lat || '-8.111867');
      const destLng = parseFloat(trip.checkOut?.lng || '-79.028751');

      const now = new Date();
      const cycleMinutes = 2;
      const secondsElapsed = (now.getMinutes() % cycleMinutes) * 60 + now.getSeconds();
      const totalSeconds = cycleMinutes * 60;
      const progress = secondsElapsed / totalSeconds;

      const currentLat = originLat + (destLat - originLat) * progress;
      const currentLng = originLng + (destLng - originLng) * progress;

      const minutesRemaining = Math.max(0, Math.round((1 - progress) * 120));

      return {
        reserverId: trip.reserverId,
        status: trip.status,
        date: trip.date,
        checkOutHour: trip.checkOutHour,
        bus: trip.bus ? {
          busId: trip.bus.busId,
          plate: trip.bus.plate,
          model: trip.bus.model,
          capacity: trip.bus.capacity,
          type: trip.bus.type,
        } : {
          busId: 0,
          plate: 'EGF-492',
          model: 'Mercedes-Benz Scania G450',
          capacity: 48,
          type: 'Imperial Class',
        },
        driver: trip.driver ? {
          userId: trip.driver.userId,
          firstName: trip.driver.firstName,
          lastName: trip.driver.lastName,
        } : {
          userId: 0,
          firstName: 'Manuel',
          lastName: 'Gomez Pastor',
        },
        origin: trip.checkIn ? {
          destinationId: trip.checkIn.destinationId,
          name: trip.checkIn.name,
          shortDescription: trip.checkIn.shortDescription,
          lat: originLat,
          lng: originLng,
        } : {
          destinationId: 1,
          name: 'Terminal Lima',
          shortDescription: 'Terminal Central Lima',
          lat: originLat,
          lng: originLng,
        },
        destination: trip.checkOut ? {
          destinationId: trip.checkOut.destinationId,
          name: trip.checkOut.name,
          shortDescription: trip.checkOut.shortDescription,
          lat: destLat,
          lng: destLng,
        } : {
          destinationId: 2,
          name: 'Terminal Trujillo',
          shortDescription: 'Terminal Principal Trujillo',
          lat: destLat,
          lng: destLng,
        },
        currentLocation: {
          lat: currentLat,
          lng: currentLng,
          progressPercentage: Math.round(progress * 100),
        },
        eta: {
          minutesRemaining,
          estimatedTimeOfArrival: new Date(now.getTime() + minutesRemaining * 60000).toISOString(),
        },
        servicesAvailable: [
          { name: 'WiFi Gratis', icon: 'wifi', available: true },
          { name: 'Tomacorriente / USB', icon: 'usb', available: true },
          { name: 'Aire Acondicionado', icon: 'air', available: true },
          { name: 'Snack a bordo', icon: 'food', available: true },
          { name: 'Asientos Reclinables 160°', icon: 'seat', available: true },
        ]
      };
    }
  }
}
