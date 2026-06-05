import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1780681687725 implements MigrationInterface {
    name = 'Tables1780681687725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_detail" DROP COLUMN "price"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_detail" ADD "price" int NOT NULL`);
    }

}
