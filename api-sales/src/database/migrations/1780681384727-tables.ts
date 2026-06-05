import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1780681384727 implements MigrationInterface {
    name = 'Tables1780681384727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "points_user" ADD "type" varchar(255) NOT NULL CONSTRAINT "DF_fd6cf599066f107be01dfc905b8" DEFAULT 'ADDITION'`);
        await queryRunner.query(`ALTER TABLE "sale" ALTER COLUMN "agencyId" int`);
        await queryRunner.query(`ALTER TABLE "sale_payer" ALTER COLUMN "userId" int`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_payer" ALTER COLUMN "userId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ALTER COLUMN "agencyId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "points_user" DROP CONSTRAINT "DF_fd6cf599066f107be01dfc905b8"`);
        await queryRunner.query(`ALTER TABLE "points_user" DROP COLUMN "type"`);
    }

}
