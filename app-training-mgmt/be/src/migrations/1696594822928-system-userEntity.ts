import { MigrationInterface, QueryRunner } from 'typeorm';

export class SystemUserEntity1696594822928 implements MigrationInterface {
  name = 'SystemUserEntity1696594822928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "system_user" ("username" character varying NOT NULL, "password" character varying, "type" character varying, "last_logged_in" TIMESTAMP, "state" jsonb, CONSTRAINT "PK_65cece187412e1eb90a5d5373c0" PRIMARY KEY ("username"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_user" ADD CONSTRAINT "FK_65cece187412e1eb90a5d5373c0" FOREIGN KEY ("username") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system_user" DROP CONSTRAINT "FK_65cece187412e1eb90a5d5373c0"`,
    );
    await queryRunner.query(`DROP TABLE "system_user"`);
  }
}
