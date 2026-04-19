import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Reserver } from './reserver.entity';
import { Floor } from '../../../modules/bus/entities/floor.entity';

@Entity()
export class ReserverPriceFloor {
  @PrimaryGeneratedColumn()
  reserverPriceFloorId: number;

  @Column()
  price: number;

  @ManyToOne(() => Reserver, (reserver) => reserver.reserverPriceFloors)
  reserver: Relation<Reserver>;

  @ManyToOne(() => Floor, (floor) => floor.reserverPriceFloors)
  floor: Relation<Floor>;
}
