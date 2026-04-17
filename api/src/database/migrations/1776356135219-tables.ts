import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1776356135219 implements MigrationInterface {
    name = 'Tables1776356135219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agency_services" ("agencyServiceId" int NOT NULL IDENTITY(1,1), "icon" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "agencyAgencyId" int, CONSTRAINT "PK_c5da8d4ebdb92a9ab6602389a21" PRIMARY KEY ("agencyServiceId"))`);
        await queryRunner.query(`ALTER TABLE "agency_services" ADD CONSTRAINT "FK_11f5ae2b4c1e6776057008d0c38" FOREIGN KEY ("agencyAgencyId") REFERENCES "agency"("agencyId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agency_services" DROP CONSTRAINT "FK_11f5ae2b4c1e6776057008d0c38"`);
        await queryRunner.query(`DROP TABLE "agency_services"`);
    }

}
