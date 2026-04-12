import { RoleEnum } from '../../../common/enum/role.enum';
import { Profile } from '../../../modules/user/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

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
}
