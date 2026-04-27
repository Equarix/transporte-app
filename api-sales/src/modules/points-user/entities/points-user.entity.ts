import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from '../../sales/entities/sale.entity';

enum PointsFrom {
  SALE = 'SALE',
  PROMOTION = 'PROMOTION',
  REWARD = 'REWARD',
}

@Entity()
export class PointsUser {
  @PrimaryGeneratedColumn()
  pointsUserId: number;

  @Column()
  userId: number;

  @Column()
  points: number;

  @Column({
    default: () => 'GETDATE()',
    type: 'datetime',
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
    default: PointsFrom.SALE,
  })
  pointsFrom: PointsFrom;

  @ManyToOne(() => Sale, (sale) => sale.pointsUsers)
  sale: Sale;
}
