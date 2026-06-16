import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PromoRedemption } from './promo-redemption.entity';

export enum PromoType {
  DESCUENTO = 'DESCUENTO',
  REGALO = 'REGALO',
}

export enum PromoStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  EXPIRADO = 'EXPIRADO',
}

export enum DiscountMode {
  PORCENTAJE = 'PORCENTAJE',
  MONTO_FIJO = 'MONTO_FIJO',
}

export enum PromoApplicableTo {
  TICKET = 'TICKET',
  HOTEL = 'HOTEL',
  AMBOS = 'AMBOS',
}

@Entity('promo')
export class Promo {
  @PrimaryGeneratedColumn()
  promoId: number;

  // ─── Identificación ───────────────────────────────────────────────────────
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  // ─── Tipo de promo ────────────────────────────────────────────────────────
  @Column({ type: 'varchar', default: PromoType.DESCUENTO })
  promoType: PromoType;

  /**
   * Solo aplica cuando promoType = DESCUENTO
   */
  @Column({ type: 'varchar', nullable: true })
  discountMode: DiscountMode;

  /**
   * Valor del descuento.
   * - Si discountMode = PORCENTAJE → valor entre 0 y 100
   * - Si discountMode = MONTO_FIJO → monto en la moneda base
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountValue: number;

  /**
   * Descuento máximo aplicable cuando discountMode = PORCENTAJE.
   * Evita descuentos desproporcionados en tickets de alto valor.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscountCap: number;

  /**
   * Solo aplica cuando promoType = REGALO.
   * Descripción/SKU del regalo que se entrega al canjear.
   */
  @Column({ type: 'varchar', length: 200, nullable: true })
  giftDescription: string;

  // ─── Alcance ──────────────────────────────────────────────────────────────
  @Column({ type: 'varchar', default: PromoApplicableTo.TICKET })
  applicableTo: PromoApplicableTo;

  /**
   * Monto mínimo de compra para que la promo aplique.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  minimumPurchaseAmount: number;

  /**
   * Rutas a las que aplica (IDs separados por coma). Null = todas las rutas.
   */
  @Column({ type: 'varchar', length: 1000, nullable: true })
  applicableRouteIds: string;

  /**
   * Agencias a las que aplica (IDs separados por coma). Null = todas.
   */
  @Column({ type: 'varchar', length: 1000, nullable: true })
  applicableAgencyIds: string;

  // ─── Disponibilidad ───────────────────────────────────────────────────────
  @Column({ type: 'datetime' })
  startsAt: Date;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  /**
   * Número máximo de usos globales. Null = ilimitado.
   */
  @Column({ type: 'int', nullable: true })
  maxGlobalUses: number;

  /**
   * Número máximo de usos por usuario. Null = ilimitado.
   */
  @Column({ type: 'int', nullable: true })
  maxUsesPerUser: number;

  @Column({ type: 'int', default: 0 })
  totalUses: number;

  @Column({ type: 'varchar', default: PromoStatus.ACTIVO })
  status: PromoStatus;

  // ─── Auditoría ────────────────────────────────────────────────────────────
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ type: 'int' })
  createdByUserId: number;

  @Column({ type: 'int', nullable: true })
  updatedByUserId: number;

  @Column({ type: 'int', nullable: true })
  deletedByUserId: number;

  @Column({ type: 'datetime', nullable: true })
  deletedAt: Date;

  // ─── Relaciones ───────────────────────────────────────────────────────────
  @OneToMany(() => PromoRedemption, (redemption) => redemption.promo)
  redemptions: PromoRedemption[];
}
