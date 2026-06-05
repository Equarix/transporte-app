import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1780681659709 implements MigrationInterface {
    name = 'Tables1780681659709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_detail" DROP COLUMN "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_detail" ADD "phone" nvarchar(255) NOT NULL`);
    }

}
