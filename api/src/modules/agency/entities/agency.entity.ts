import { Galery } from '../../../modules/galery/entities/galery.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { AgencyServiceEntity } from './agency-services.entity';
import { ReserverAgency } from '../../../modules/reserver/entities/reserver-angecy.entity';
import { UserAgency } from '../../../modules/auth/entities/user-agency.entity';

@Entity()
export class Agency {
  @PrimaryGeneratedColumn()
  agencyId: number;

  @Column()
  name: string;

  @Column()
  largeAddress: string;

  @Column({
    default: '',
  })
  slug: string;

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

  @OneToMany(() => AgencyServiceEntity, (agencyService) => agencyService.agency)
  services: Relation<AgencyServiceEntity[]>;

  @OneToMany(() => UserAgency, (userAgency) => userAgency.agency)
  userAgencies: Relation<UserAgency[]>;

  @OneToMany(() => ReserverAgency, (reserverAgency) => reserverAgency.agency)
  reserverAgencies: Relation<ReserverAgency[]>;
}
