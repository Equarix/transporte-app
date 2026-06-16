import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Promo } from './promo.entity';

export enum RedemptionStatus {
  PENDIENTE = 'PENDIENTE',
  APLICADO = 'APLICADO',
  REVERTIDO = 'REVERTIDO',
}

@Entity('promo_redemption')
export class PromoRedemption {
  @PrimaryGeneratedColumn()
  redemptionId: number;

  // ─── Contexto de compra ───────────────────────────────────────────────────
  @Column({ type: 'int' })
  saleId: number;

  @Column({ type: 'int' })
  userId: number;

  // ─── Efecto aplicado ─────────────────────────────────────────────────────
  /**
   * Monto del descuento aplicado en la moneda base.
   * 0 si la promo es de tipo REGALO.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountApplied: number;

  /**
   * Descripción del regalo entregado, si aplica.
   */
  @Column({ type: 'varchar', length: 200, nullable: true })
  giftDelivered: string | undefined;

  @Column({ type: 'varchar', default: RedemptionStatus.PENDIENTE })
  status: RedemptionStatus;

  // ─── Auditoría ────────────────────────────────────────────────────────────
  @CreateDateColumn({ type: 'datetime' })
  redeemedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  revertedAt: Date | undefined;

  @Column({ type: 'int', nullable: true })
  revertedByUserId: number | undefined;

  // ─── Relaciones ───────────────────────────────────────────────────────────
  @ManyToOne(() => Promo, (promo) => promo.redemptions)
  promo: Relation<Promo>;
}
