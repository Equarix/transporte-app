import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1779125476239 implements MigrationInterface {
    name = 'Tables1779125476239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" ADD "agencyId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "reserverId" int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "reserverId"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "agencyId"`);
    }

}
