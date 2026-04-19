import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Seat } from './seat.entity';
import { Bus } from './bus.entity';
import { ReserverPriceFloor } from '../../../modules/reserver/entities/reserver-price-floor.entity';

@Entity()
export class Floor {
  @PrimaryGeneratedColumn()
  floorId: number;

  @Column()
  name: string;

  @Column()
  order: number;

  @Column()
  columns: number;

  @Column()
  rows: number;

  @ManyToOne(() => Bus, (bus) => bus.floors)
  bus: Relation<Bus>;

  @OneToMany(() => Seat, (seat) => seat.floor)
  seats: Relation<Seat[]>;

  @Column({ default: true })
  status: boolean;

  @OneToMany(
    () => ReserverPriceFloor,
    (reserverPriceFloor) => reserverPriceFloor.floor,
  )
  reserverPriceFloors: Relation<ReserverPriceFloor[]>;
}
