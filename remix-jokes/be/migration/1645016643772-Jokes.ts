import { MigrationInterface, QueryRunner } from 'typeorm';

export class Jokes1645016643772 implements MigrationInterface {
  name = 'Jokes1645016643772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Joke" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "content" character varying NOT NULL, "jokesterId" uuid, CONSTRAINT "PK_3aa353e0bf0a8cc6b65d801f595" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Joke" ADD CONSTRAINT "FK_21f4f0691fa8dccf045d7c100ad" FOREIGN KEY ("jokesterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Joke" DROP CONSTRAINT "FK_21f4f0691fa8dccf045d7c100ad"`,
    );
    await queryRunner.query(`DROP TABLE "Joke"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
