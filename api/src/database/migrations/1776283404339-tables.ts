import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1776283404339 implements MigrationInterface {
    name = 'Tables1776283404339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "destination" DROP COLUMN "longDescription"`);
        await queryRunner.query(`ALTER TABLE "destination" ADD "longDescription" varchar(MAX) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "destination" DROP COLUMN "longDescription"`);
        await queryRunner.query(`ALTER TABLE "destination" ADD "longDescription" nvarchar(255) NOT NULL`);
    }

}
