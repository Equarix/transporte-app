import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePointsUserDto } from './dto/create-points-user.dto';
import { UpdatePointsUserDto } from './dto/update-points-user.dto';
import { PointsFrom, PointsUser, TypePointsMovement } from './entities/points-user.entity';
import { Promo, PromoStatus, PromoType, DiscountMode } from '../promos/entities/promo.entity';
import { PromoRedemption, RedemptionStatus } from '../promos/entities/promo-redemption.entity';

@Injectable()
export class PointsUserService {
  constructor(
    @InjectRepository(PointsUser)
    private readonly pointsUserRepository: Repository<PointsUser>,
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
    @InjectRepository(PromoRedemption)
    private readonly redemptionRepository: Repository<PromoRedemption>,
  ) {}

  create(createPointsUserDto: CreatePointsUserDto) {
    return 'This action adds a new pointsUser';
  }

  findAll() {
    return `This action returns all pointsUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pointsUser`;
  }

  update(id: number, updatePointsUserDto: UpdatePointsUserDto) {
    return `This action updates a #${id} pointsUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} pointsUser`;
  }

  async getPointsReport() {
    // Calculate total issued
    const issuedRes = await this.pointsUserRepository
      .createQueryBuilder('pu')
      .select('SUM(pu.points)', 'total')
      .where('pu.type = :type', { type: TypePointsMovement.ADDITION })
      .getRawOne();
    const totalIssued = parseInt(issuedRes?.total || '0', 10);

    // Calculate total redeemed
    const redeemedRes = await this.pointsUserRepository
      .createQueryBuilder('pu')
      .select('SUM(pu.points)', 'total')
      .where('pu.type = :type', { type: TypePointsMovement.SUBTRACTION })
      .getRawOne();
    const totalRedeemed = parseInt(redeemedRes?.total || '0', 10);

    // Active members (unique userIds)
    const activeMembersRes = await this.pointsUserRepository
      .createQueryBuilder('pu')
      .select('COUNT(DISTINCT pu.userId)', 'count')
      .getRawOne();
    const activeMembers = parseInt(activeMembersRes?.count || '0', 10);

    // Get date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Top members grouping by userId
    const rawTopMembers = await this.pointsUserRepository
      .createQueryBuilder('pu')
      .select('pu.userId', 'userId')
      .addSelect(
        "SUM(CASE WHEN pu.type = 'ADDITION' THEN pu.points ELSE -pu.points END)",
        'pointBalance',
      )
      .addSelect(
        `SUM(CASE 
          WHEN pu.type = 'ADDITION' AND pu.createdAt >= :thirtyDaysAgo THEN pu.points 
          WHEN pu.type = 'SUBTRACTION' AND pu.createdAt >= :thirtyDaysAgo THEN -pu.points 
          ELSE 0 
         END)`,
        'monthlyVelocity',
      )
      .setParameter('thirtyDaysAgo', thirtyDaysAgo)
      .groupBy('pu.userId')
      .orderBy('pointBalance', 'DESC')
      .limit(10)
      .getRawMany();

    const topMembers = rawTopMembers.map((member) => {
      const balance = parseInt(member.pointBalance || '0', 10);
      const velocityVal = parseInt(member.monthlyVelocity || '0', 10);

      // Determine level tier based on points balance
      let status = 'SILVER';
      if (balance > 40000) {
        status = 'DIAMOND';
      } else if (balance > 15000) {
        status = 'PLATINUM';
      } else if (balance > 5000) {
        status = 'GOLD';
      }

      // Format velocity label
      let velocity = 'Estable';
      if (velocityVal > 0) {
        velocity = velocityVal >= 1000 
          ? `+${(velocityVal / 1000).toFixed(1)}k / mes` 
          : `+${velocityVal} / mes`;
      } else if (velocityVal < 0) {
        const absVal = Math.abs(velocityVal);
        velocity = absVal >= 1000 
          ? `-${(absVal / 1000).toFixed(1)}k / mes` 
          : `-${absVal} / mes`;
      }

      return {
        userId: parseInt(member.userId, 10),
        pointBalance: balance,
        status,
        velocity,
      };
    });

    // Calculate accumulationRate (percentage of active members with point movements in the last 30 days)
    const activeThisMonthRes = await this.pointsUserRepository
      .createQueryBuilder('pu')
      .select('COUNT(DISTINCT pu.userId)', 'count')
      .where('pu.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getRawOne();
    const activeThisMonth = parseInt(activeThisMonthRes?.count || '0', 10);
    const accumulationRate = activeMembers > 0 ? Math.round((activeThisMonth / activeMembers) * 100) : 0;

    // Calculate redemptionRate (percentage of total redeemed points over total issued points)
    const redemptionRate = totalIssued > 0 ? Math.round((totalRedeemed / totalIssued) * 100) : 0;

    return {
      totalIssued,
      totalRedeemed,
      activeMembers,
      accumulationRate,
      redemptionRate,
      topMembers,
    };
  }

  async getUserPoints(userId: number) {
    const movements = await this.pointsUserRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const balance = movements.reduce((acc, curr) => {
      return curr.type === TypePointsMovement.ADDITION ? acc + curr.points : acc - curr.points;
    }, 0);

    return {
      balance,
      movements,
    };
  }

  async redeemPoints(userId: number, rewardId: string, points: number) {
    const userPoints = await this.getUserPoints(userId);
    if (userPoints.balance < points) {
      throw new Error('Puntos insuficientes');
    }

    // Map reward ID to Promo specifications
    let promoCode = '';
    let promoName = '';
    let promoDescription = '';
    let promoType = PromoType.DESCUENTO;
    let discountMode: DiscountMode | null = null;
    let discountValue = 0;
    let giftDescription: string | null = null;

    if (rewardId === 'desc15') {
      promoCode = 'DESC15';
      promoName = '15% Descuento';
      promoDescription = 'Descuento del 15% en tu próximo pasaje nacional.';
      promoType = PromoType.DESCUENTO;
      discountMode = DiscountMode.PORCENTAJE;
      discountValue = 15;
    } else if (rewardId === 'upgrade_suite') {
      promoCode = 'UPGRADE_SUITE';
      promoName = 'Upgrade a Suite Class';
      promoDescription = 'Sube de categoría a Suite Class y viaja con la máxima comodidad.';
      promoType = PromoType.DESCUENTO;
      discountMode = DiscountMode.PORCENTAJE;
      discountValue = 100;
    } else if (rewardId === 'desayuno_bordo') {
      promoCode = 'DESAYUNO_BORDO';
      promoName = 'Desayuno a bordo gratis';
      promoDescription = 'Disfruta de un desayuno de cortesía durante tu viaje.';
      promoType = PromoType.REGALO;
      giftDescription = 'Desayuno a bordo';
    } else {
      throw new Error('Tipo de recompensa inválido');
    }

    // Find or create the Promo in database
    let promo = await this.promoRepository.findOne({
      where: { code: promoCode },
    });

    if (!promo) {
      const now = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(now.getFullYear() + 1);

      promo = this.promoRepository.create({
        code: promoCode,
        name: promoName,
        description: promoDescription,
        promoType,
        discountMode: discountMode ?? undefined,
        discountValue,
        giftDescription: giftDescription ?? undefined,
        startsAt: now,
        expiresAt: oneYearFromNow,
        status: PromoStatus.ACTIVO,
        minimumPurchaseAmount: 0,
        createdByUserId: 1, // Default Admin
      });
      promo = await this.promoRepository.save(promo);
    }

    // Save point subtraction
    const pointMovement = this.pointsUserRepository.create({
      userId,
      points,
      pointsFrom: PointsFrom.REWARD,
      type: TypePointsMovement.SUBTRACTION,
    });
    await this.pointsUserRepository.save(pointMovement);

    // Create PENDIENTE redemption associated with the promo (using saleId = 0 as placeholder)
    const redemption = this.redemptionRepository.create({
      userId,
      saleId: 0,
      discountApplied: 0,
      giftDelivered: giftDescription ?? undefined,
      status: RedemptionStatus.PENDIENTE,
      promo,
    });
    await this.redemptionRepository.save(redemption);

    return pointMovement;
  }
}
