import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from './sale.entity';

@Entity()
export class HotelDetail {
  @PrimaryGeneratedColumn()
  hotelDetailId: number;

  @Column()
  hotelId: number;

  @Column()
  referenceNumber: string;

  @Column()
  clientName: string;

  @Column()
  roomId: number;

  @Column()
  hotelName: string;

  @Column()
  checkIn: Date;

  @Column()
  checkOut: Date;

  @Column()
  amount: number;

  @ManyToOne(() => Sale, (sale) => sale.hotelDetails)
  sale: Sale;
}
