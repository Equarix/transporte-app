import { Galery } from '../../../modules/galery/entities/galery.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity()
export class Agency {
  @PrimaryGeneratedColumn()
  agencyId: number;

  @Column()
  name: string;

  @Column()
  largeAddress: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  description: string;

  @Column({ default: true })
  status: boolean;

  @Column()
  lat: string;

  @Column()
  lng: string;

  @ManyToOne(() => Galery, (galery) => galery.agency)
  galery: Relation<Galery>;
}
