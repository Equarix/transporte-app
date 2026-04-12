import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1775246935252 implements MigrationInterface {
    name = 'Tables1775246935252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("userId" int NOT NULL IDENTITY(1,1), "password" nvarchar(255) NOT NULL, "typeDocument" nvarchar(255) NOT NULL, "documentNumber" nvarchar(255) NOT NULL, "role" varchar(255) NOT NULL CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 'user', "profileUserId" int, CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_8fbc5ddde72dd2f99fad04ff78" ON "user" ("profileUserId") WHERE "profileUserId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "profile" ("userId" int NOT NULL IDENTITY(1,1), "typeDocument" nvarchar(255) NOT NULL, "documentNumber" nvarchar(255) NOT NULL, "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "phone" nvarchar(255) NOT NULL, "dateOfBirth" datetime NOT NULL, CONSTRAINT "PK_a24972ebd73b106250713dcddd9" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "agency" ("agencyId" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "largeAddress" nvarchar(255) NOT NULL, "address" nvarchar(255) NOT NULL, "phone" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "status" bit NOT NULL CONSTRAINT "DF_0f1a1548f279c21782034ac464b" DEFAULT 1, "lat" nvarchar(255) NOT NULL, "lng" nvarchar(255) NOT NULL, "galeryImageId" int, CONSTRAINT "PK_7ee0b4217b8ecdcc6481f47c15b" PRIMARY KEY ("agencyId"))`);
        await queryRunner.query(`CREATE TABLE "galery" ("imageId" int NOT NULL IDENTITY(1,1), "imageUrl" nvarchar(255) NOT NULL, "createdAt" nvarchar(255) NOT NULL CONSTRAINT "DF_b13f71337270015621ddd557303" DEFAULT GETDATE(), "imageName" nvarchar(255) NOT NULL, CONSTRAINT "PK_26fe776c86be1b34a910611f6e9" PRIMARY KEY ("imageId"))`);
        await queryRunner.query(`CREATE TABLE "destination" ("destinationId" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "shortDescription" nvarchar(255) NOT NULL, "longDescription" nvarchar(255) NOT NULL, "lat" nvarchar(255) NOT NULL, "lng" nvarchar(255) NOT NULL, "status" bit NOT NULL CONSTRAINT "DF_87c56a486de302db93c4fee644e" DEFAULT 1, "galeryImageId" int, CONSTRAINT "PK_53d88d7f0da40a9034e05e7a701" PRIMARY KEY ("destinationId"))`);
        await queryRunner.query(`CREATE TABLE "experience" ("experienceId" int NOT NULL IDENTITY(1,1), "type" varchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "lat" nvarchar(255), "lng" nvarchar(255), "destinationDestinationId" int, "galeryImageId" int, CONSTRAINT "PK_07513790eab0075ee6fea2a2102" PRIMARY KEY ("experienceId"))`);
        await queryRunner.query(`CREATE TABLE "bus" ("busId" int NOT NULL IDENTITY(1,1), "plate" nvarchar(255) NOT NULL, "model" nvarchar(255) NOT NULL, "year" int NOT NULL, "capacity" int NOT NULL, "status" bit NOT NULL CONSTRAINT "DF_6a8fe89f3413ab2ee47c57377e5" DEFAULT 1, CONSTRAINT "PK_7e875e228f9b3e398b7fabbd9c3" PRIMARY KEY ("busId"))`);
        await queryRunner.query(`CREATE TABLE "floor" ("floorId" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "order" int NOT NULL, "columns" int NOT NULL, "rows" int NOT NULL, "status" bit NOT NULL CONSTRAINT "DF_9f3c76b7e26e01f7d42e8c98963" DEFAULT 1, "busBusId" int, CONSTRAINT "PK_3111c833368a9760c1cf346b78e" PRIMARY KEY ("floorId"))`);
        await queryRunner.query(`CREATE TABLE "seat" ("seatId" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "typeSeat" varchar(255) NOT NULL CONSTRAINT "DF_5b2e1acfed9a5ff102e1e13e4b5" DEFAULT 'asiento', "status" bit NOT NULL CONSTRAINT "DF_6fc8d074ccceade88d1e6904db4" DEFAULT 1, "row" int NOT NULL, "column" int NOT NULL, "floorFloorId" int, CONSTRAINT "PK_7a05cc54c63048462c266497616" PRIMARY KEY ("seatId"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8fbc5ddde72dd2f99fad04ff783" FOREIGN KEY ("profileUserId") REFERENCES "profile"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agency" ADD CONSTRAINT "FK_a0b652c8e5139877848733c4b52" FOREIGN KEY ("galeryImageId") REFERENCES "galery"("imageId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "destination" ADD CONSTRAINT "FK_8b7283051584316a0fb6299fa43" FOREIGN KEY ("galeryImageId") REFERENCES "galery"("imageId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience" ADD CONSTRAINT "FK_385ef2ea066838c29acff1de0aa" FOREIGN KEY ("destinationDestinationId") REFERENCES "destination"("destinationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience" ADD CONSTRAINT "FK_81e389a2f311ddab3a2c5616eae" FOREIGN KEY ("galeryImageId") REFERENCES "galery"("imageId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "floor" ADD CONSTRAINT "FK_8c314f8d584b701463a4554ad72" FOREIGN KEY ("busBusId") REFERENCES "bus"("busId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seat" ADD CONSTRAINT "FK_246710d667bee80b95169634218" FOREIGN KEY ("floorFloorId") REFERENCES "floor"("floorId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seat" DROP CONSTRAINT "FK_246710d667bee80b95169634218"`);
        await queryRunner.query(`ALTER TABLE "floor" DROP CONSTRAINT "FK_8c314f8d584b701463a4554ad72"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP CONSTRAINT "FK_81e389a2f311ddab3a2c5616eae"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP CONSTRAINT "FK_385ef2ea066838c29acff1de0aa"`);
        await queryRunner.query(`ALTER TABLE "destination" DROP CONSTRAINT "FK_8b7283051584316a0fb6299fa43"`);
        await queryRunner.query(`ALTER TABLE "agency" DROP CONSTRAINT "FK_a0b652c8e5139877848733c4b52"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8fbc5ddde72dd2f99fad04ff783"`);
        await queryRunner.query(`DROP TABLE "seat"`);
        await queryRunner.query(`DROP TABLE "floor"`);
        await queryRunner.query(`DROP TABLE "bus"`);
        await queryRunner.query(`DROP TABLE "experience"`);
        await queryRunner.query(`DROP TABLE "destination"`);
        await queryRunner.query(`DROP TABLE "galery"`);
        await queryRunner.query(`DROP TABLE "agency"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP INDEX "REL_8fbc5ddde72dd2f99fad04ff78" ON "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
