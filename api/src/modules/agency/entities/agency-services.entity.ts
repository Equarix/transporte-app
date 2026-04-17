import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Agency } from './agency.entity';

@Entity('agency_services')
export class AgencyServiceEntity {
  @PrimaryGeneratedColumn()
  agencyServiceId: number;

  @Column()
  icon: string;

  @Column()
  name: string;

  @ManyToOne(() => Agency, (agency) => agency.services)
  agency: Relation<Agency>;
}
