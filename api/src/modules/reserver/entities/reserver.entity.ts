import { User } from '../../../modules/auth/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { StatusReserverEnum } from '../enum/status-reserver.enum';
import { Destination } from '../../../modules/destination/entities/destination.entity';
import { Bus } from '../../../modules/bus/entities/bus.entity';
import { Profile } from '../../../modules/user/entities/profile.entity';

@Entity()
export class Reserver {
  @PrimaryGeneratedColumn()
  reserverId: number;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.reservers)
  registerUser: Relation<User>;

  @Column({
    default: () => 'GETDATE()',
  })
  registerAt: Date;

  @Column({
    type: 'varchar',
    default: StatusReserverEnum.PENDING,
  })
  status: StatusReserverEnum;

  @ManyToOne(() => Destination, (destination) => destination.checkIns)
  checkIn: Relation<Destination>;

  @ManyToOne(() => Destination, (d) => d.checkOuts)
  checkOut: Relation<Destination>;

  @ManyToOne(() => Bus, (b) => b.reservers)
  bus: Relation<Bus>;

  @ManyToOne(() => Profile, (user) => user.reserversAsDriver)
  driver: Relation<Profile>;
}
