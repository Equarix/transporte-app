import { User } from '../../../modules/auth/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { StatusReserverEnum } from '../enum/status-reserver.enum';
import { Destination } from '../../../modules/destination/entities/destination.entity';
import { Bus } from '../../../modules/bus/entities/bus.entity';
import { Profile } from '../../../modules/user/entities/profile.entity';
import { ReserverPriceFloor } from './reserver-price-floor.entity';
import { ReserverAgency } from './reserver-angecy.entity';

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

  @OneToMany(
    () => ReserverPriceFloor,
    (reserverPriceFloor) => reserverPriceFloor.reserver,
  )
  reserverPriceFloors: Relation<ReserverPriceFloor[]>;

  @OneToMany(() => ReserverAgency, (reserverAgency) => reserverAgency.reserver)
  reserverAgencies: Relation<ReserverAgency[]>;
}
