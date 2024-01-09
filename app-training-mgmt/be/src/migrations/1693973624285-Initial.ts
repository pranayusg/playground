import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1693973624285 implements MigrationInterface {
  name = 'Initial1693973624285';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(
      `CREATE TABLE "raw_training_dashboard" ("emp_id" character varying NOT NULL, "name" character varying NOT NULL, "designation" character varying NOT NULL, "reporting_manager" character varying NOT NULL, "client_director" character varying NOT NULL, "client_name" character varying NOT NULL, "resource_type" character varying, "doj" TIMESTAMP NOT NULL, "trainer" character varying, "type_of_training" character varying NOT NULL, "batche_type" character varying NOT NULL, "batch_type_description" character varying NOT NULL, "training_start_date" TIMESTAMP, "training_end_date" TIMESTAMP, "batch_status" character varying, "employee_status" character varying, "is_processed" boolean, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_88a372d838e20ca8296d1af9159" PRIMARY KEY ("emp_id", "doj", "type_of_training", "batche_type", "batch_type_description"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "raw_batch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batch_title" character varying NOT NULL, "tech" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "training_coordinator" character varying NOT NULL, "head_trainer" character varying NOT NULL, "no_of_trainees" integer, "no_of_success" integer, "no_of_failed" integer, "status" character varying, "is_processed" boolean, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eb6112961d8a300558e2c763ee3" PRIMARY KEY ("id", "batch_title", "tech", "start_date", "training_coordinator", "head_trainer"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "job" ("job_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_name" character varying NOT NULL, "status" character varying NOT NULL, "file_path" character varying, "summary" jsonb, "job_type" character varying, "import_type" character varying, "error_file_link" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_25526336589e1d6f5b5d9c5b74b" PRIMARY KEY ("job_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "job"`);
    await queryRunner.query(`DROP TABLE "raw_batch"`);
    await queryRunner.query(`DROP TABLE "raw_training_dashboard"`);
  }
}
