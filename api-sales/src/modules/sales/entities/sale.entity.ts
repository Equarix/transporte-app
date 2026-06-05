import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HotelDetail } from './hotel_detail.entity';
import { SaleDetail } from './sale_detail.entity';
import { PointsUser } from '../../../modules/points-user/entities/points-user.entity';
import { SalePayer } from './sale_payer.entity';

export enum StatusSale {
  PENDING = 'PENDIENTE',
  APPROVED = 'APROBADO',
  CANCELLED = 'CANCELADO',
}

export enum SaleFrom {
  WEB = 'WEB',
  TAQUILLA = 'TAQUILLA',
}

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  saleId: number;

  @Column({
    default: () => 'GETDATE()',
    type: 'datetime',
  })
  createdAt: Date;

  @Column()
  userId: number;

  @Column({
    type: 'varchar',
    default: StatusSale.PENDING,
  })
  status: StatusSale;

  @Column()
  purchaseFrom: SaleFrom;

  @OneToMany(() => HotelDetail, (hotelDetail) => hotelDetail.sale)
  hotelDetails: HotelDetail[];

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale)
  saleDetails: SaleDetail[];

  @Column()
  fromDestinationId: number;

  @Column()
  toDestinationId: number;

  @Column({ nullable: true })
  agencyId: number;

  @Column()
  reserverId: number;

  @OneToMany(() => PointsUser, (pointsUser) => pointsUser.sale)
  pointsUsers: PointsUser[];

  @ManyToOne(() => SalePayer, (salePayer) => salePayer.sale)
  salePayer: SalePayer;
}
