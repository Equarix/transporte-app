import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
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
  amount: number;

  @Column()
  row: number;

  @Column()
  column: number;

  @Column()
  floor: number;

  @Column()
  typeSeat: string;

  @ManyToOne(() => Sale, (sale) => sale.saleDetails)
  sale: Relation<Sale>;
}
