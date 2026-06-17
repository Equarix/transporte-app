import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1781724690788 implements MigrationInterface {
    name = 'Tables1781724690788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification_alert" ("alertId" int NOT NULL IDENTITY(1,1), "userId" int NOT NULL, "title" nvarchar(255) NOT NULL, "message" varchar(MAX) NOT NULL, "code" nvarchar(255), "discount" nvarchar(255), "sentAt" datetime2 NOT NULL CONSTRAINT "DF_76fbd2bfb4e1d05e2c779245472" DEFAULT getdate(), "isRead" bit NOT NULL CONSTRAINT "DF_74fde9318817d9ae160fad944ca" DEFAULT 0, CONSTRAINT "PK_6443a22adce4a835ddc76259dc3" PRIMARY KEY ("alertId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notification_alert"`);
    }

}
