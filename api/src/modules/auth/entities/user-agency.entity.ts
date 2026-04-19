import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from './user.entity';
import { Agency } from '../../../modules/agency/entities/agency.entity';

@Entity()
export class UserAgency {
  @PrimaryGeneratedColumn()
  userAgencyId: number;

  @ManyToOne(() => User, (user) => user.userAgencies)
  user: Relation<User>;

  @ManyToOne(() => Agency, (agency) => agency.userAgencies)
  agency: Relation<Agency>;

  @Column({
    default: () => 'GETDATE()',
  })
  createdAt: Date;

  @Column({
    default: true,
  })
  status: boolean;
}
