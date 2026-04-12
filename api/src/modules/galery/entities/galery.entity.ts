import { Experience } from '../../../modules/destination/entities/experiences.entity';
import { Destination } from '../../../modules/destination/entities/destination.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Agency } from '../../../modules/agency/entities/agency.entity';

@Entity()
export class Galery {
  @PrimaryGeneratedColumn()
  imageId: number;
  @Column()
  imageUrl: string;
  @Column({
    default: () => 'GETDATE()',
  })
  createdAt: string;

  @Column()
  imageName: string;

  @OneToMany(() => Destination, (destination) => destination.galery)
  destination: Destination[];

  @OneToMany(() => Experience, (experience) => experience.galery)
  experience: Experience[];

  @OneToMany(() => Agency, (agency) => agency.galery)
  agency: Agency[];
}
