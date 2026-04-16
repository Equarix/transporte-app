import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1776347333468 implements MigrationInterface {
    name = 'Tables1776347333468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserver" DROP CONSTRAINT "FK_10c03a6e6e791708c1682bcfc90"`);
        await queryRunner.query(`ALTER TABLE "reserver" ADD CONSTRAINT "FK_10c03a6e6e791708c1682bcfc90" FOREIGN KEY ("driverUserId") REFERENCES "profile"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserver" DROP CONSTRAINT "FK_10c03a6e6e791708c1682bcfc90"`);
        await queryRunner.query(`ALTER TABLE "reserver" ADD CONSTRAINT "FK_10c03a6e6e791708c1682bcfc90" FOREIGN KEY ("driverUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
