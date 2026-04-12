import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Floor } from './floor.entity';

export enum TypeSeat {
  ASIENTO = 'asiento',
  LIMPIEZA = 'limpieza',
  ESCALERA = 'escalera',
}

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  seatId: number;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    default: TypeSeat.ASIENTO,
  })
  typeSeat: TypeSeat;

  @Column({ default: true })
  status: boolean;

  @Column()
  row: number;

  @Column()
  column: number;

  @ManyToOne(() => Floor, (floor) => floor.seats)
  floor: Relation<Floor>;
}
