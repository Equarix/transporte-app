import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Destination } from './destination.entity';
import { ExperienceType } from '../enum/experiencie.enum';
import { Galery } from '../../../modules/galery/entities/galery.entity';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  experienceId: number;

  @Column({
    type: 'varchar',
  })
  type: ExperienceType;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    length: 'MAX',
  })
  description: string;

  @ManyToOne(() => Destination, (destination) => destination.experiences)
  destination: Relation<Destination>;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lng: string;

  @ManyToOne(() => Galery, (galery) => galery.experience)
  galery: Galery;
}
