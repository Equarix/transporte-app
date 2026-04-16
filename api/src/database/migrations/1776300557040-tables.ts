import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1776300557040 implements MigrationInterface {
    name = 'Tables1776300557040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "isActive" bit NOT NULL CONSTRAINT "DF_a2497419c269397f7b9ab7561c8" DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "DF_a2497419c269397f7b9ab7561c8"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "isActive"`);
    }

}
