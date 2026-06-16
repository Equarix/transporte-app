import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Resena } from './entities/resena.entity';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';

@Injectable()
export class ResenaService {
  constructor(
    @InjectRepository(Resena)
    private readonly resenaRepository: Repository<Resena>,
  ) {}

  async create(createResenaDto: CreateResenaDto): Promise<Resena> {
    const resena = this.resenaRepository.create(createResenaDto);
    return await this.resenaRepository.save(resena);
  }

  async findAll(): Promise<Resena[]> {
    return await this.resenaRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Resena | null> {
    return await this.resenaRepository.findOneBy({ resenaId: id });
  }

  async update(id: number, updateResenaDto: UpdateResenaDto): Promise<Resena | null> {
    const resena = await this.findOne(id);
    if (!resena) return null;
    Object.assign(resena, updateResenaDto);
    return await this.resenaRepository.save(resena);
  }

  async remove(id: number): Promise<{ success: boolean }> {
    await this.resenaRepository.delete(id);
    return { success: true };
  }

  async findReviewedSaleIds(userId: number, saleIds: number[]): Promise<number[]> {
    if (!saleIds || saleIds.length === 0) return [];
    
    const reviews = await this.resenaRepository.find({
      where: {
        userId,
        saleId: In(saleIds),
      },
      select: ['saleId'],
    });

    return reviews.map((r) => r.saleId);
  }

  async getMetrics(): Promise<any> {
    const reviews = await this.resenaRepository.find();
    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        avgComfort: 0,
        avgPunctuality: 0,
        avgService: 0,
        avgDriver: 0,
        avgOverall: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    let sumComfort = 0;
    let sumPunctuality = 0;
    let sumService = 0;
    let sumDriver = 0;
    let sumOverall = 0;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const r of reviews) {
      sumComfort += r.comfortScore;
      sumPunctuality += r.punctualityScore;
      sumService += r.serviceScore;
      sumDriver += r.driverScore;
      
      const overall = (r.comfortScore + r.punctualityScore + r.serviceScore + r.driverScore) / 4;
      sumOverall += overall;

      const roundedOverall = Math.round(overall);
      if (distribution[roundedOverall] !== undefined) {
        distribution[roundedOverall]++;
      } else {
        distribution[roundedOverall] = 1;
      }
    }

    return {
      totalReviews,
      avgComfort: parseFloat((sumComfort / totalReviews).toFixed(2)),
      avgPunctuality: parseFloat((sumPunctuality / totalReviews).toFixed(2)),
      avgService: parseFloat((sumService / totalReviews).toFixed(2)),
      avgDriver: parseFloat((sumDriver / totalReviews).toFixed(2)),
      avgOverall: parseFloat((sumOverall / totalReviews).toFixed(2)),
      ratingDistribution: distribution,
    };
  }
}
