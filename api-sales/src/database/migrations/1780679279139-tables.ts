import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1780679279139 implements MigrationInterface {
    name = 'Tables1780679279139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sale_payer" ("salePayerId" int NOT NULL IDENTITY(1,1), "userId" int NOT NULL, "documentType" nvarchar(255) NOT NULL, "documentNumber" nvarchar(255) NOT NULL, "names" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "phone" nvarchar(255) NOT NULL, "providerMethod" nvarchar(255) NOT NULL, "typeMethod" nvarchar(255) NOT NULL, CONSTRAINT "PK_079532cca1e1b030510e20faa9b" PRIMARY KEY ("salePayerId"))`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "salePayerSalePayerId" int`);
        await queryRunner.query(`ALTER TABLE "sale_detail" ADD "row" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale_detail" ADD "column" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale_detail" ADD "floor" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale_detail" ADD "price" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale_detail" ADD "typeSeat" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_78e8754fbc165b4e359055eb764" FOREIGN KEY ("salePayerSalePayerId") REFERENCES "sale_payer"("salePayerId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_78e8754fbc165b4e359055eb764"`);
        await queryRunner.query(`ALTER TABLE "sale_detail" DROP COLUMN "typeSeat"`);
        await queryRunner.query(`ALTER TABLE "sale_detail" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "sale_detail" DROP COLUMN "floor"`);
        await queryRunner.query(`ALTER TABLE "sale_detail" DROP COLUMN "column"`);
        await queryRunner.query(`ALTER TABLE "sale_detail" DROP COLUMN "row"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "salePayerSalePayerId"`);
        await queryRunner.query(`DROP TABLE "sale_payer"`);
    }

}
