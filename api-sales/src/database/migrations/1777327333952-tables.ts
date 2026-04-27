import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1777327333952 implements MigrationInterface {
    name = 'Tables1777327333952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_detail" ADD "saleSaleId" int`);
        await queryRunner.query(`ALTER TABLE "hotel_detail" ADD CONSTRAINT "FK_56a6302f5c02eec43d530e947b3" FOREIGN KEY ("saleSaleId") REFERENCES "sale"("saleId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_detail" DROP CONSTRAINT "FK_56a6302f5c02eec43d530e947b3"`);
        await queryRunner.query(`ALTER TABLE "hotel_detail" DROP COLUMN "saleSaleId"`);
    }

}
