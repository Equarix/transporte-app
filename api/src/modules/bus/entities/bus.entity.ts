import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Floor } from './floor.entity';
import { Reserver } from '../../../modules/reserver/entities/reserver.entity';

@Entity()
export class Bus {
  @PrimaryGeneratedColumn()
  busId: number;
  //TODO:CAMBIAR PARA QUE NO TENGA POR DEFECTO
  @Column({
    default: '',
  })
  type: string;

  @Column({
    default: '',
  })
  name: string;

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

  @OneToMany(() => Reserver, (r) => r.bus)
  reservers: Reserver[];
}
