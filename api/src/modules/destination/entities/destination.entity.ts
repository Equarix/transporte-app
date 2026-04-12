import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Experience } from './experiences.entity';
import { Galery } from '../../../modules/galery/entities/galery.entity';

@Entity()
export class Destination {
  @PrimaryGeneratedColumn()
  destinationId: number;

  @Column()
  name: string;

  @Column()
  shortDescription: string;

  @Column()
  longDescription: string;

  @OneToMany(() => Experience, (experience) => experience.destination)
  experiences: Experience[];

  @Column()
  lat: string;

  @Column()
  lng: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => Galery, (galery) => galery.destination)
  galery: Galery;
}
