import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Resena {
  @PrimaryGeneratedColumn()
  resenaId: number;

  @Column({ type: 'int' })
  saleId: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  comfortScore: number;

  @Column({ type: 'int' })
  punctualityScore: number;

  @Column({ type: 'int' })
  serviceScore: number;

  @Column({ type: 'int' })
  driverScore: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string | null;

  @Column({
    default: () => 'GETDATE()',
    type: 'datetime',
  })
  createdAt: Date;
}
