import { User } from '../../../modules/auth/entities/user.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { TypeUser } from '../enum/type-user.enum';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  typeDocument: string;

  @Column()
  documentNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    default: TypeUser.CLIENT,
  })
  typeUser: TypeUser;

  @Column({
    default: true,
  })
  isActive: boolean;

  @OneToOne(() => User, (user) => user.profile)
  user: Relation<User>;
}
