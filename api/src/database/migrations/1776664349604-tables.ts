import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1776664349604 implements MigrationInterface {
    name = 'Tables1776664349604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserver_agency" ADD "hour" nvarchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserver_agency" DROP COLUMN "hour"`);
    }

}
