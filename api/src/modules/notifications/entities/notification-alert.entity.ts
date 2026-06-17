import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class NotificationAlert {
  @PrimaryGeneratedColumn()
  alertId: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column({ type: 'varchar', length: 'MAX' })
  message: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ nullable: true })
  discount?: string;

  @CreateDateColumn()
  sentAt: Date;

  @Column({ default: false })
  isRead: boolean;
}
