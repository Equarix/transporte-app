import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from './sale.entity';

@Entity()
export class SalePayer {
  @PrimaryGeneratedColumn()
  salePayerId: number;

  @Column({ nullable: true })
  userId: number;

  @Column()
  documentType: string;

  @Column()
  documentNumber: string;

  @Column()
  names: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  providerMethod: string;

  @Column()
  typeMethod: string;

  @OneToMany(() => Sale, (sale) => sale.salePayer)
  sale: Sale[];
}
