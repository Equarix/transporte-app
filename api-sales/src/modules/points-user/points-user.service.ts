import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePointsUserDto } from './dto/create-points-user.dto';
import { UpdatePointsUserDto } from './dto/update-points-user.dto';
import { PointsUser, TypePointsMovement } from './entities/points-user.entity';

@Injectable()
export class PointsUserService {
  constructor(
    @InjectRepository(PointsUser)
    private readonly pointsUserRepository: Repository<PointsUser>,
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
}
