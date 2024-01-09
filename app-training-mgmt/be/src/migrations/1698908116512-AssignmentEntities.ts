import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignmentEntities1698908116512 implements MigrationInterface {
  name = 'AssignmentEntities1698908116512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tech" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "mpath" character varying DEFAULT '', "parentId" uuid, CONSTRAINT "PK_d7eeeeef666045db381daafa4d8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tech_training" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "topic" character varying NOT NULL, "description" character varying NOT NULL, "level" character varying NOT NULL, "tech_id" uuid, CONSTRAINT "PK_a341d085082fbbb4b954b71727f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assignment_outline" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "topic" character varying NOT NULL, "duration" integer NOT NULL, "link" character varying, "rating_keys" jsonb NOT NULL, "tech_training_id" uuid, CONSTRAINT "PK_042ad2f4ce9de0141c380e401f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."feedback_assignment_status_enum" AS ENUM('Pending', 'Submitted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedback_assignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ratings" jsonb, "overall_rating" character varying NOT NULL, "comment" character varying NOT NULL, "submission_date" TIMESTAMP, "status" "public"."feedback_assignment_status_enum" NOT NULL, "batch_assignment_outline_id" uuid, "emp_id" character varying, CONSTRAINT "PK_463802bb50f62ef03f217f99d2a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "batch_assignment_outline" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "assignment_outline_id" uuid, "batch_id" uuid, CONSTRAINT "PK_0ddba2794e9f91dce71810f3f4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "batch" DROP COLUMN "tech"`);
    await queryRunner.query(
      `ALTER TABLE "batch" ADD "tech_topic" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch" ADD "feedback_comment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch" ADD "average_ratings_by_trainees" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "batch" ADD "no_of_trainees" integer`);
    await queryRunner.query(`ALTER TABLE "batch" ADD "tech_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "tech" ADD CONSTRAINT "FK_d5c99d2c3f74b9bba2e2d6fd75b" FOREIGN KEY ("parentId") REFERENCES "tech"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tech_training" ADD CONSTRAINT "FK_6fab343322d500418fd56401ea4" FOREIGN KEY ("tech_id") REFERENCES "tech"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_outline" ADD CONSTRAINT "FK_7bdadf488d66a73c6c002c18018" FOREIGN KEY ("tech_training_id") REFERENCES "tech_training"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "feedback_assignment" ADD CONSTRAINT "FK_1fb4c49cd8bbfbba64fe3bd098b" FOREIGN KEY ("batch_assignment_outline_id") REFERENCES "batch_assignment_outline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_assignment" ADD CONSTRAINT "FK_0ef59abf386ba9fdae0ea150d1e" FOREIGN KEY ("emp_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_assignment_outline" ADD CONSTRAINT "FK_41467ff6517e9001bb6deacfb05" FOREIGN KEY ("assignment_outline_id") REFERENCES "assignment_outline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_assignment_outline" ADD CONSTRAINT "FK_4e87f9edf4c894040d7dddcf505" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch" ADD CONSTRAINT "FK_79e4ebac4dd7bca63d6c4269583" FOREIGN KEY ("tech_id") REFERENCES "tech"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "batch" DROP CONSTRAINT "FK_79e4ebac4dd7bca63d6c4269583"`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_assignment_outline" DROP CONSTRAINT "FK_4e87f9edf4c894040d7dddcf505"`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch_assignment_outline" DROP CONSTRAINT "FK_41467ff6517e9001bb6deacfb05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_assignment" DROP CONSTRAINT "FK_0ef59abf386ba9fdae0ea150d1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_assignment" DROP CONSTRAINT "FK_1fb4c49cd8bbfbba64fe3bd098b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_outline" ADD CONSTRAINT "FK_a0451dd124ceee0404fa20ee2cb" FOREIGN KEY ("tech_training_id") REFERENCES "tech_training"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "tech_training" DROP CONSTRAINT "FK_6fab343322d500418fd56401ea4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tech" DROP CONSTRAINT "FK_d5c99d2c3f74b9bba2e2d6fd75b"`,
    );
    await queryRunner.query(`ALTER TABLE "batch" DROP COLUMN "tech_id"`);
    await queryRunner.query(`ALTER TABLE "batch" DROP COLUMN "no_of_trainees"`);
    await queryRunner.query(
      `ALTER TABLE "batch" DROP COLUMN "average_ratings_by_trainees"`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch" DROP COLUMN "feedback_comment"`,
    );
    await queryRunner.query(`ALTER TABLE "batch" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "batch" DROP COLUMN "tech_topic"`);
    await queryRunner.query(
      `ALTER TABLE "batch" ADD "tech" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "batch_assignment_outline"`);
    await queryRunner.query(`DROP TABLE "feedback_assignment"`);
    await queryRunner.query(
      `DROP TYPE "public"."feedback_assignment_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "assignment_outline"`);
    await queryRunner.query(`DROP TABLE "tech_training"`);
    await queryRunner.query(`DROP TABLE "tech"`);
  }
}
