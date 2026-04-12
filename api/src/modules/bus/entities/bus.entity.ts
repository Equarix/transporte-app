import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Floor } from './floor.entity';

@Entity()
export class Bus {
  @PrimaryGeneratedColumn()
  busId: number;

  @Column()
  plate: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  capacity: number;

  @OneToMany(() => Floor, (floor) => floor.bus)
  floors: Floor[];

  @Column({ default: true })
  status: boolean;
}
