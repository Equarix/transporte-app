import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1776666685631 implements MigrationInterface {
    name = 'Tables1776666685631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agency" ADD "slug" nvarchar(255) NOT NULL CONSTRAINT "DF_233490623e751cac6cfd894f96e" DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agency" DROP CONSTRAINT "DF_233490623e751cac6cfd894f96e"`);
        await queryRunner.query(`ALTER TABLE "agency" DROP COLUMN "slug"`);
    }

}
