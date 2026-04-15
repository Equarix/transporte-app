import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1776285208826 implements MigrationInterface {
    name = 'Tables1776285208826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reserver" ("reserverId" int NOT NULL IDENTITY(1,1), "date" datetime NOT NULL, "registerAt" datetime NOT NULL CONSTRAINT "DF_90e164f11ba487e8bf507c434c5" DEFAULT GETDATE(), "status" varchar(255) NOT NULL CONSTRAINT "DF_3384001206cd84aaf49db81f03e" DEFAULT 'PENDING', "registerUserUserId" int, "checkInDestinationId" int, "checkOutDestinationId" int, "busBusId" int, "driverUserId" int, CONSTRAINT "PK_ca2a0e1236f44ebeca8e10713e3" PRIMARY KEY ("reserverId"))`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "typeUser" varchar(255) NOT NULL CONSTRAINT "DF_8c23eccfe16dc3e3432e3030634" DEFAULT 'CLIENT'`);
        await queryRunner.query(`ALTER TABLE "reserver" ADD CONSTRAINT "FK_3eb4b2acbbbb578db379c2c6be5" FOREIGN KEY ("registerUserUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reserver" ADD CONSTRAINT "FK_bb9a6172a3f33f6595c54218ab9" FOREIGN KEY ("checkInDestinationId") REFERENCES "destination"("destinationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reserver" ADD CONSTRAINT "FK_e89c39b21cd1d25d0ae508cb9b8" FOREIGN KEY ("checkOutDestinationId") REFERENCES "destination"("destinationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reserver" ADD CONSTRAINT "FK_5a07e489ce46947ef9d6e790990" FOREIGN KEY ("busBusId") REFERENCES "bus"("busId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reserver" ADD CONSTRAINT "FK_10c03a6e6e791708c1682bcfc90" FOREIGN KEY ("driverUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserver" DROP CONSTRAINT "FK_10c03a6e6e791708c1682bcfc90"`);
        await queryRunner.query(`ALTER TABLE "reserver" DROP CONSTRAINT "FK_5a07e489ce46947ef9d6e790990"`);
        await queryRunner.query(`ALTER TABLE "reserver" DROP CONSTRAINT "FK_e89c39b21cd1d25d0ae508cb9b8"`);
        await queryRunner.query(`ALTER TABLE "reserver" DROP CONSTRAINT "FK_bb9a6172a3f33f6595c54218ab9"`);
        await queryRunner.query(`ALTER TABLE "reserver" DROP CONSTRAINT "FK_3eb4b2acbbbb578db379c2c6be5"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "DF_8c23eccfe16dc3e3432e3030634"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "typeUser"`);
        await queryRunner.query(`DROP TABLE "reserver"`);
    }

}
