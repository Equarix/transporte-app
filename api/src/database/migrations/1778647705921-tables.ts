import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1778647705921 implements MigrationInterface {
    name = 'Tables1778647705921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "destination" ADD "slug" nvarchar(255) NOT NULL CONSTRAINT "DF_effdbf888408e57fba9a35086bb" DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "destination" DROP CONSTRAINT "DF_effdbf888408e57fba9a35086bb"`);
        await queryRunner.query(`ALTER TABLE "destination" DROP COLUMN "slug"`);
    }

}
