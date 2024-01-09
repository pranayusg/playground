import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActivityTables1702355293542 implements MigrationInterface {
  name = 'ActivityTables1702355293542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "assignment_outline_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_8074e380942bf7d59898d00216b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "batch_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_c1d7582819193d3cad19e3fdb1a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "batch_assignment_outline_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_b47dc770055adbb8c5962e8d43b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "evaluation_criteria_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_32d154d6f80f2e94c2aa82a90b5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tech_training_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_e15bde0c7368d62a17f2b7dd2c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tech_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_5fefd6f48a6fd09b01cda628be8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "training_detail_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_8a4bb68813893299564c0515e4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "certification_ongoing_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_be9e9ba8e7b7944a8ac667816f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "certification_approved_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_c163626de05b3e503463e4a06e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedback_assignment_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_bec4c0c3dd38731b4dbac37562b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedback_trainees_batch_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_48547eb4493766efd3095844acb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "certification_achieved_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, "record_id" character varying NOT NULL, "existing_data" jsonb, "new_date" jsonb, CONSTRAINT "PK_1b215aad2dfbaa43d765f9fcfc9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "certification_achieved_activity"`);
    await queryRunner.query(`DROP TABLE "feedback_trainees_batch_activity"`);
    await queryRunner.query(`DROP TABLE "feedback_assignment_activity"`);
    await queryRunner.query(`DROP TABLE "certification_approved_activity"`);
    await queryRunner.query(`DROP TABLE "certification_ongoing_activity"`);
    await queryRunner.query(`DROP TABLE "training_detail_activity"`);
    await queryRunner.query(`DROP TABLE "tech_activity"`);
    await queryRunner.query(`DROP TABLE "tech_training_activity"`);
    await queryRunner.query(`DROP TABLE "evaluation_criteria_activity"`);
    await queryRunner.query(`DROP TABLE "batch_assignment_outline_activity"`);
    await queryRunner.query(`DROP TABLE "batch_activity"`);
    await queryRunner.query(`DROP TABLE "assignment_outline_activity"`);
  }
}
