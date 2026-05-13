import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1778650751534 implements MigrationInterface {
    name = 'Tables1778650751534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserver" ADD "checkOutHour" nvarchar(255) NOT NULL CONSTRAINT "DF_2cdaa57feedb96fc27f50667a04" DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserver" DROP CONSTRAINT "DF_2cdaa57feedb96fc27f50667a04"`);
        await queryRunner.query(`ALTER TABLE "reserver" DROP COLUMN "checkOutHour"`);
    }

}
