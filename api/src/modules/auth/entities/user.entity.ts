import { Reserver } from '../../../modules/reserver/entities/reserver.entity';
import { RoleEnum } from '../../../common/enum/role.enum';
import { Profile } from '../../../modules/user/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { UserAgency } from './user-agency.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  password: string;

  @Column()
  typeDocument: string;

  @Column()
  documentNumber: string;

  @Column({
    type: 'varchar',
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Relation<Profile>;

  @OneToMany(() => Reserver, (reserver) => reserver.registerUser)
  reservers: Relation<Reserver[]>;

  @OneToMany(() => UserAgency, (userAgency) => userAgency.user)
  userAgencies: Relation<UserAgency[]>;
}
