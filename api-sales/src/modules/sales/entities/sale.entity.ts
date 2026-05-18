import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HotelDetail } from './hotel_detail.entity';
import { SaleDetail } from './sale_detail.entity';
import { PointsUser } from '../../../modules/points-user/entities/points-user.entity';

enum StatusSale {
  PENDING = 'PENDIENTE',
  APPROVED = 'APROBADO',
  CANCELLED = 'CANCELADO',
}

enum SaleFrom {
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

  @Column()
  agencyId: number;

  @Column()
  reserverId: number;

  @OneToMany(() => PointsUser, (pointsUser) => pointsUser.sale)
  pointsUsers: PointsUser[];
}
