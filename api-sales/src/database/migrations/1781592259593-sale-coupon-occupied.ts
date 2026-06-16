import { MigrationInterface, QueryRunner } from "typeorm";

export class SaleCouponOccupied1781592259593 implements MigrationInterface {
    name = 'SaleCouponOccupied1781592259593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" ADD "promoCode" varchar(50)`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "discount" decimal(10,2) NOT NULL CONSTRAINT "DF_f5fa7da368398c29e6c3adc0d97" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "promo_redemption" ADD "code" varchar(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promo_redemption" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "DF_f5fa7da368398c29e6c3adc0d97"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "promoCode"`);
    }

}
