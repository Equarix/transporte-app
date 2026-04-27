import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from './sale.entity';

@Entity()
export class SaleDetail {
  @PrimaryGeneratedColumn()
  saleDetailId: number;

  @Column()
  busId: number;

  @Column()
  seatId: number;

  @Column()
  documentType: string;

  @Column()
  documentNumber: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  clientId: string;

  @Column()
  amount: number;

  @ManyToOne(() => Sale, (sale) => sale.saleDetails)
  sale: Sale;
}
