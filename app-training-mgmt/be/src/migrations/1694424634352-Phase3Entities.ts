import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase3Entities1694424634352 implements MigrationInterface {
  name = 'Phase3Entities1694424634352';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "raw_achieved" ("emp_id" character varying NOT NULL, "first_name" character varying NOT NULL, "certification" character varying NOT NULL, "level" character varying NOT NULL, "exam" character varying NOT NULL, "achieved_date" TIMESTAMP NOT NULL, "expiry_date" TIMESTAMP, "certification_link" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bde9a34fefe308dfd0752e8c39a" PRIMARY KEY ("emp_id", "first_name", "certification", "level", "exam"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "raw_approved_certification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tech" character varying NOT NULL, "certificaton_name" character varying NOT NULL, "level" character varying NOT NULL, "cost_in_dollars" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_71f4cf54f057f741838af3139f6" PRIMARY KEY ("id", "tech", "certificaton_name", "level"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "raw_ongoing" ("emp_id" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "certification" character varying NOT NULL, "exam" character varying NOT NULL, "start_date" TIMESTAMP, "expected_end_date" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "when" TIMESTAMP, "what" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af3eb2e773e4f23fd9a048341c7" PRIMARY KEY ("emp_id", "first_name", "certification", "exam"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "raw_ongoing"`);
    await queryRunner.query(`DROP TABLE "raw_approved_certification"`);
    await queryRunner.query(`DROP TABLE "raw_achieved"`);
  }
}
