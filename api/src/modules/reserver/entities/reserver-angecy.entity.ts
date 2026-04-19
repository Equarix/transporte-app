import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Reserver } from './reserver.entity';
import { Agency } from '../../../modules/agency/entities/agency.entity';

@Entity()
export class ReserverAgency {
  @PrimaryGeneratedColumn()
  reserverAgencyId: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @ManyToOne(() => Reserver, (reserver) => reserver.reserverAgencies)
  reserver: Relation<Reserver>;

  @ManyToOne(() => Agency, (agency) => agency.reserverAgencies)
  agency: Relation<Agency>;
}
