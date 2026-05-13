import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1778643649285 implements MigrationInterface {
    name = 'Tables1778643649285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bus" ADD "type" nvarchar(255) NOT NULL CONSTRAINT "DF_9f735214dfcc93c3bebcf5736c4" DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "bus" ADD "name" nvarchar(255) NOT NULL CONSTRAINT "DF_d1797f1177f516d0f41aac65acc" DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bus" DROP CONSTRAINT "DF_d1797f1177f516d0f41aac65acc"`);
        await queryRunner.query(`ALTER TABLE "bus" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "bus" DROP CONSTRAINT "DF_9f735214dfcc93c3bebcf5736c4"`);
        await queryRunner.query(`ALTER TABLE "bus" DROP COLUMN "type"`);
    }

}
