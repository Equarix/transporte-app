import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1776555105272 implements MigrationInterface {
    name = 'Tables1776555105272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agency" DROP CONSTRAINT "FK_474b7f7545541ab436557a3a01b"`);
        await queryRunner.query(`CREATE TABLE "user_agency" ("userAgencyId" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_d520d3b353e631861befc0cc722" DEFAULT GETDATE(), "status" bit NOT NULL CONSTRAINT "DF_c887df106c1fcd2cd2445dbb519" DEFAULT 1, "userUserId" int, "agencyAgencyId" int, CONSTRAINT "PK_e17133cabef06ba2e9595715c6d" PRIMARY KEY ("userAgencyId"))`);
        await queryRunner.query(`ALTER TABLE "agency" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "user_agency" ADD CONSTRAINT "FK_26f370f5a3ad21701f6a5f38e15" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_agency" ADD CONSTRAINT "FK_c63625e3fd3943261d5ac7de6bd" FOREIGN KEY ("agencyAgencyId") REFERENCES "agency"("agencyId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_agency" DROP CONSTRAINT "FK_c63625e3fd3943261d5ac7de6bd"`);
        await queryRunner.query(`ALTER TABLE "user_agency" DROP CONSTRAINT "FK_26f370f5a3ad21701f6a5f38e15"`);
        await queryRunner.query(`ALTER TABLE "agency" ADD "userUserId" int`);
        await queryRunner.query(`DROP TABLE "user_agency"`);
        await queryRunner.query(`ALTER TABLE "agency" ADD CONSTRAINT "FK_474b7f7545541ab436557a3a01b" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
