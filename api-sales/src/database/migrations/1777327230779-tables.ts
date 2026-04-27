import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1777327230779 implements MigrationInterface {
    name = 'Tables1777327230779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hotel_detail" ("hotelDetailId" int NOT NULL IDENTITY(1,1), "hotelId" int NOT NULL, "referenceNumber" nvarchar(255) NOT NULL, "clientName" nvarchar(255) NOT NULL, "roomId" int NOT NULL, "hotelName" nvarchar(255) NOT NULL, "checkIn" datetime NOT NULL, "checkOut" datetime NOT NULL, "amount" int NOT NULL, CONSTRAINT "PK_8cb8e3508deada2ac59c85fc96f" PRIMARY KEY ("hotelDetailId"))`);
        await queryRunner.query(`CREATE TABLE "sale_detail" ("saleDetailId" int NOT NULL IDENTITY(1,1), "busId" int NOT NULL, "seatId" int NOT NULL, "documentType" nvarchar(255) NOT NULL, "documentNumber" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "phone" nvarchar(255) NOT NULL, "clientId" nvarchar(255) NOT NULL, "amount" int NOT NULL, "saleSaleId" int, CONSTRAINT "PK_d508e7c5bb31f30b0bbbca121d5" PRIMARY KEY ("saleDetailId"))`);
        await queryRunner.query(`CREATE TABLE "points_user" ("pointsUserId" int NOT NULL IDENTITY(1,1), "userId" int NOT NULL, "points" int NOT NULL, "createdAt" datetime NOT NULL CONSTRAINT "DF_468daeff0a4c0be0d5ffd14a7ce" DEFAULT GETDATE(), "pointsFrom" varchar(255) NOT NULL CONSTRAINT "DF_72fa5f611533272269ef16b5026" DEFAULT 'SALE', "saleSaleId" int, CONSTRAINT "PK_564cc5eb4101f9087410daebc3d" PRIMARY KEY ("pointsUserId"))`);
        await queryRunner.query(`CREATE TABLE "sale" ("saleId" int NOT NULL IDENTITY(1,1), "createdAt" datetime NOT NULL CONSTRAINT "DF_3baf347d3b88577a5de27fca003" DEFAULT GETDATE(), "userId" int NOT NULL, "status" varchar(255) NOT NULL CONSTRAINT "DF_51ccbf07b7f3d6040d6082f805a" DEFAULT 'PENDIENTE', "purchaseFrom" nvarchar(255) NOT NULL, "fromDestinationId" int NOT NULL, "toDestinationId" int NOT NULL, CONSTRAINT "PK_61e9fc39f22df5682850ea649f2" PRIMARY KEY ("saleId"))`);
        await queryRunner.query(`ALTER TABLE "sale_detail" ADD CONSTRAINT "FK_5577177eb9ed86f21c841e04b0c" FOREIGN KEY ("saleSaleId") REFERENCES "sale"("saleId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "points_user" ADD CONSTRAINT "FK_61517b6bdcd8ebdac11f0757f0e" FOREIGN KEY ("saleSaleId") REFERENCES "sale"("saleId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "points_user" DROP CONSTRAINT "FK_61517b6bdcd8ebdac11f0757f0e"`);
        await queryRunner.query(`ALTER TABLE "sale_detail" DROP CONSTRAINT "FK_5577177eb9ed86f21c841e04b0c"`);
        await queryRunner.query(`DROP TABLE "sale"`);
        await queryRunner.query(`DROP TABLE "points_user"`);
        await queryRunner.query(`DROP TABLE "sale_detail"`);
        await queryRunner.query(`DROP TABLE "hotel_detail"`);
    }

}
