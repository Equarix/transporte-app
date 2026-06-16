import { MigrationInterface, QueryRunner } from "typeorm";

export class Resena1781591167240 implements MigrationInterface {
    name = 'Resena1781591167240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "resena" ("resenaId" int NOT NULL IDENTITY(1,1), "saleId" int NOT NULL, "userId" int NOT NULL, "comfortScore" int NOT NULL, "punctualityScore" int NOT NULL, "serviceScore" int NOT NULL, "driverScore" int NOT NULL, "comment" varchar(500), "createdAt" datetime NOT NULL CONSTRAINT "DF_abab964bb63177a31094c808fdc" DEFAULT GETDATE(), CONSTRAINT "PK_f8bddc8f0be9aace4976b3e9947" PRIMARY KEY ("resenaId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "resena"`);
    }

}
