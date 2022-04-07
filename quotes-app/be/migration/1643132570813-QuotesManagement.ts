import {MigrationInterface, QueryRunner} from "typeorm";

export class QuotesManagement1643132570813 implements MigrationInterface {
    name = 'QuotesManagement1643132570813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quotes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "quote" character varying NOT NULL, "author" character varying NOT NULL, "likes" integer NOT NULL DEFAULT '0', "dislikes" integer NOT NULL DEFAULT '0', "tags" character varying, "userId" uuid, CONSTRAINT "PK_99a0e8bcbcd8719d3a41f23c263" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favouriteQuote" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "like" boolean, "dislike" boolean, "userId" uuid, "quoteId" uuid, CONSTRAINT "PK_3040f065da51001f71678ea0429" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quotes" ADD CONSTRAINT "FK_8bad8bd49d1dd6954b46366349c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favouriteQuote" ADD CONSTRAINT "FK_5fbf619c8f945f20959d3a4d07d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favouriteQuote" ADD CONSTRAINT "FK_77d0b2392275ecb8bd0bdb9c82b" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favouriteQuote" DROP CONSTRAINT "FK_77d0b2392275ecb8bd0bdb9c82b"`);
        await queryRunner.query(`ALTER TABLE "favouriteQuote" DROP CONSTRAINT "FK_5fbf619c8f945f20959d3a4d07d"`);
        await queryRunner.query(`ALTER TABLE "quotes" DROP CONSTRAINT "FK_8bad8bd49d1dd6954b46366349c"`);
        await queryRunner.query(`DROP TABLE "favouriteQuote"`);
        await queryRunner.query(`DROP TABLE "quotes"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
