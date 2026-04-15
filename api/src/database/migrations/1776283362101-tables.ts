import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1776283362101 implements MigrationInterface {
    name = 'Tables1776283362101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "description" varchar(MAX) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "description" nvarchar(255) NOT NULL`);
    }

}
