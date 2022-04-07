import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskManagement1636482206068 implements MigrationInterface {
  name = 'TaskManagement1636482206068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "middleName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "dob" date NOT NULL, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Tasks" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL, "userid" uuid NOT NULL, CONSTRAINT "PK_f38c2a61ff630a16afca4dac442" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Tasks" ADD CONSTRAINT "FK_6cc52d7017473915db80d8dba3a" FOREIGN KEY ("userid") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Tasks" DROP CONSTRAINT "FK_6cc52d7017473915db80d8dba3a"`,
    );
    await queryRunner.query(`DROP TABLE "Tasks"`);
    await queryRunner.query(`DROP TABLE "Users"`);
  }
}
