import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1780681623373 implements MigrationInterface {
    name = 'Tables1780681623373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_detail" DROP COLUMN "clientId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_detail" ADD "clientId" nvarchar(255) NOT NULL`);
    }

}
