import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1781583866920 implements MigrationInterface {
    name = 'Tables1781583866920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promo_redemption" ("redemptionId" int NOT NULL IDENTITY(1,1), "saleId" int NOT NULL, "userId" int NOT NULL, "discountApplied" decimal(10,2) NOT NULL CONSTRAINT "DF_3df817e4c0d456e0bda6ca2749e" DEFAULT 0, "giftDelivered" varchar(200), "status" varchar(255) NOT NULL CONSTRAINT "DF_2350fb971b8a34c352e56648830" DEFAULT 'PENDIENTE', "redeemedAt" datetime NOT NULL CONSTRAINT "DF_e797ceefa4377f4fe3d0c3ba7b9" DEFAULT getdate(), "revertedAt" datetime, "revertedByUserId" int, "promoPromoId" int, CONSTRAINT "PK_362f40fb70bf04d57e9bcc13612" PRIMARY KEY ("redemptionId"))`);
        await queryRunner.query(`CREATE TABLE "promo" ("promoId" int NOT NULL IDENTITY(1,1), "code" varchar(50) NOT NULL, "name" varchar(150) NOT NULL, "description" varchar(500), "promoType" varchar(255) NOT NULL CONSTRAINT "DF_cbedeacbcb502bda2ff67c614e4" DEFAULT 'DESCUENTO', "discountMode" varchar(255), "discountValue" decimal(10,2), "maxDiscountCap" decimal(10,2), "giftDescription" varchar(200), "applicableTo" varchar(255) NOT NULL CONSTRAINT "DF_efc1a112ea50bee1a96dd13cdb0" DEFAULT 'TICKET', "minimumPurchaseAmount" decimal(10,2) NOT NULL CONSTRAINT "DF_c669129823b8cdd30db6068fe10" DEFAULT 0, "applicableRouteIds" varchar(1000), "applicableAgencyIds" varchar(1000), "startsAt" datetime NOT NULL, "expiresAt" datetime NOT NULL, "maxGlobalUses" int, "maxUsesPerUser" int, "totalUses" int NOT NULL CONSTRAINT "DF_f8ba9a8c7b61809e6ac5cb66845" DEFAULT 0, "status" varchar(255) NOT NULL CONSTRAINT "DF_e9015899bae26e920b607c6530a" DEFAULT 'ACTIVO', "createdAt" datetime NOT NULL CONSTRAINT "DF_3827f48c67c3da3e56f9d7e9d0a" DEFAULT getdate(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_07986e78c9736d8c9e8c705de0b" DEFAULT getdate(), "createdByUserId" int NOT NULL, "updatedByUserId" int, "deletedByUserId" int, "deletedAt" datetime, CONSTRAINT "UQ_3ff1cb7045502ac76b57a544b0b" UNIQUE ("code"), CONSTRAINT "PK_777c98133bca2b113d4fd16adc0" PRIMARY KEY ("promoId"))`);
        await queryRunner.query(`ALTER TABLE "promo_redemption" ADD CONSTRAINT "FK_3d67574ebd5e24fc8841565dde9" FOREIGN KEY ("promoPromoId") REFERENCES "promo"("promoId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promo_redemption" DROP CONSTRAINT "FK_3d67574ebd5e24fc8841565dde9"`);
        await queryRunner.query(`DROP TABLE "promo"`);
        await queryRunner.query(`DROP TABLE "promo_redemption"`);
    }

}
