import {MigrationInterface, QueryRunner} from "typeorm";

export class QuotesManagement1637565469278 implements MigrationInterface {
    name = 'QuotesManagement1637565469278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Quotes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quote" character varying NOT NULL, "author" character varying NOT NULL, "likes" integer NOT NULL DEFAULT '0', "dislikes" integer NOT NULL DEFAULT '0', "tags" character varying, CONSTRAINT "PK_bfe55f34d69d35c638df1ce0c6f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Quotes"`);
    }

}
