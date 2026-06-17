import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Destination } from 'src/modules/destination/entities/destination.entity';
import { Reserver } from 'src/modules/reserver/entities/reserver.entity';
import { StatusReserverEnum } from 'src/modules/reserver/enum/status-reserver.enum';
import { In, Repository } from 'typeorm';

@Injectable()
export class PublicDestinationService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,

    @InjectRepository(Reserver)
    private reserverRepository: Repository<Reserver>,
  ) {}

  getDestinations() {
    return this.destinationRepository.find({
      where: {
        status: true,
      },
    });
  }

  async getDestinosConectados() {
    const rawRoutes = await this.reserverRepository
      .createQueryBuilder('reserver')
      .select('MIN(reserver.reserverId)', 'reserverId')
      .where('reserver.status = :status', { status: StatusReserverEnum.CONFIRMED })
      .groupBy('reserver.checkInDestinationId')
      .addGroupBy('reserver.checkOutDestinationId')
      .getRawMany();

    if (rawRoutes.length === 0) return [];

    const ids = rawRoutes.map((r) => r.reserverId);

    return this.reserverRepository.find({
      where: {
        reserverId: In(ids),
      },
      relations: {
        checkIn: true,
        checkOut: true,
      },
    });
  }

  async getTouristReviews() {
    const destinations = await this.destinationRepository.find({
      where: {
        status: true,
      },
      relations: {
        experiences: {
          galery: true,
        },
        galery: true,
      },
    });

    return destinations.map((dest) => {
      let scoreComfort = 4.8;
      let scorePunctuality = 4.9;
      let scoreService = 4.7;
      let scoreDriver = 4.9;
      const reviews = [
        {
          author: "Carlos Mendoza",
          rating: 5,
          comment: `¡Excelente viaje a ${dest.name}! Muy puntuales y los asientos sumamente cómodos.`,
          date: "2026-06-10",
        },
        {
          author: "Ana G.",
          rating: 4.8,
          comment: `El servicio a bordo en la ruta hacia ${dest.name} es de primer nivel, totalmente recomendado.`,
          date: "2026-06-12",
        },
      ];

      if (dest.name.toLowerCase().includes("chiclayo")) {
        scoreComfort = 4.9;
        scorePunctuality = 4.8;
        reviews.push({
          author: "Roberto Vega",
          rating: 5,
          comment: "La comida a bordo y la atención del tripulante fueron excepcionales.",
          date: "2026-06-15",
        });
      } else if (dest.name.toLowerCase().includes("trujillo")) {
        scoreComfort = 4.8;
        scorePunctuality = 5.0;
        reviews.push({
          author: "Sofia R.",
          rating: 4.9,
          comment: "Viaje rápido, seguro y con Wifi estable durante todo el trayecto.",
          date: "2026-06-16",
        });
      }

      const avgOverall = parseFloat(
        ((scoreComfort + scorePunctuality + scoreService + scoreDriver) / 4).toFixed(1)
      );

      return {
        destinationId: dest.destinationId,
        name: dest.name,
        slug: dest.slug,
        shortDescription: dest.shortDescription,
        longDescription: dest.longDescription,
        lat: dest.lat,
        lng: dest.lng,
        galery: dest.galery,
        experiences: dest.experiences,
        metrics: {
          avgComfort: scoreComfort,
          avgPunctuality: scorePunctuality,
          avgService: scoreService,
          avgDriver: scoreDriver,
          avgOverall,
        },
        reviews,
      };
    });
  }
}
