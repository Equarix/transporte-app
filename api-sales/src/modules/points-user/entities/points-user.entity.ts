import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Sale } from '../../sales/entities/sale.entity';

enum PointsFrom {
  SALE = 'SALE',
  PROMOTION = 'PROMOTION',
  REWARD = 'REWARD',
}

enum TypePointsMovement {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
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

  @Column({
    type: 'varchar',
    default: TypePointsMovement.ADDITION,
  })
  type: TypePointsMovement;

  @ManyToOne(() => Sale, (sale) => sale.pointsUsers)
  sale: Relation<Sale>;
}
