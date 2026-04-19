import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1776554629648 implements MigrationInterface {
    name = 'Tables1776554629648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`EXEC sp_rename "transporte.dbo.agency.GeoLocation", "userUserId"`);
        await queryRunner.query(`CREATE TABLE "reserver_agency" ("reserverAgencyId" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "address" nvarchar(255) NOT NULL, "phone" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "reserverReserverId" int, "agencyAgencyId" int, CONSTRAINT "PK_8a0decd29fe2c16c0dc4c6a287e" PRIMARY KEY ("reserverAgencyId"))`);
        await queryRunner.query(`CREATE TABLE "reserver_price_floor" ("reserverPriceFloorId" int NOT NULL IDENTITY(1,1), "price" int NOT NULL, "reserverReserverId" int, "floorFloorId" int, CONSTRAINT "PK_aeb2fd2349468905738e84fa0b3" PRIMARY KEY ("reserverPriceFloorId"))`);
        await queryRunner.query(`ALTER TABLE "agency" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "agency" ADD "userUserId" int`);
        await queryRunner.query(`ALTER TABLE "reserver_agency" ADD CONSTRAINT "FK_903a986edce0746d7b225a1fe0c" FOREIGN KEY ("reserverReserverId") REFERENCES "reserver"("reserverId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reserver_agency" ADD CONSTRAINT "FK_12cd0a0be349c6d1864a67fe639" FOREIGN KEY ("agencyAgencyId") REFERENCES "agency"("agencyId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agency" ADD CONSTRAINT "FK_474b7f7545541ab436557a3a01b" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reserver_price_floor" ADD CONSTRAINT "FK_0d3612fb581afee995bb0f40dc8" FOREIGN KEY ("reserverReserverId") REFERENCES "reserver"("reserverId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reserver_price_floor" ADD CONSTRAINT "FK_53f77289b743e36a4ee44391daa" FOREIGN KEY ("floorFloorId") REFERENCES "floor"("floorId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserver_price_floor" DROP CONSTRAINT "FK_53f77289b743e36a4ee44391daa"`);
        await queryRunner.query(`ALTER TABLE "reserver_price_floor" DROP CONSTRAINT "FK_0d3612fb581afee995bb0f40dc8"`);
        await queryRunner.query(`ALTER TABLE "agency" DROP CONSTRAINT "FK_474b7f7545541ab436557a3a01b"`);
        await queryRunner.query(`ALTER TABLE "reserver_agency" DROP CONSTRAINT "FK_12cd0a0be349c6d1864a67fe639"`);
        await queryRunner.query(`ALTER TABLE "reserver_agency" DROP CONSTRAINT "FK_903a986edce0746d7b225a1fe0c"`);
        await queryRunner.query(`ALTER TABLE "agency" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "agency" ADD "userUserId" geography`);
        await queryRunner.query(`DROP TABLE "reserver_price_floor"`);
        await queryRunner.query(`DROP TABLE "reserver_agency"`);
        await queryRunner.query(`EXEC sp_rename "transporte.dbo.agency.userUserId", "GeoLocation"`);
    }

}
