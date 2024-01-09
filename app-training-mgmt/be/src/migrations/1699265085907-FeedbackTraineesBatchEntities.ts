import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeedbackTraineesBatchEntities1699265085907
  implements MigrationInterface
{
  name = 'FeedbackTraineesBatchEntities1699265085907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."question_question_type_enum" AS ENUM('text', 'mcq')`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "question_text" character varying NOT NULL, "question_type" "public"."question_question_type_enum" NOT NULL, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "option_text" character varying NOT NULL, "order" integer NOT NULL, "question_id" uuid, CONSTRAINT "PK_64f8e42188891f2b0610017c8f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedback_trainees_batch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "answer_text" character varying, "question_id" uuid, "answer_option_id" uuid, "batch_id" uuid, "emp_id" character varying, CONSTRAINT "PK_ff31dad6928e731463c674af800" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_option" ADD CONSTRAINT "FK_747190c37a39feced5efcbb303f" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_trainees_batch" ADD CONSTRAINT "FK_265b72d5658f29655f5657a3006" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_trainees_batch" ADD CONSTRAINT "FK_d848d6cf158030fdcdd3292a054" FOREIGN KEY ("answer_option_id") REFERENCES "question_option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_trainees_batch" ADD CONSTRAINT "FK_60bf1e6046ded9466eec2abfef0" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_trainees_batch" ADD CONSTRAINT "FK_43bf0498491e2b60d0f62d88f0f" FOREIGN KEY ("emp_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedback_trainees_batch" DROP CONSTRAINT "FK_43bf0498491e2b60d0f62d88f0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_trainees_batch" DROP CONSTRAINT "FK_60bf1e6046ded9466eec2abfef0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_trainees_batch" DROP CONSTRAINT "FK_d848d6cf158030fdcdd3292a054"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_trainees_batch" DROP CONSTRAINT "FK_265b72d5658f29655f5657a3006"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_option" DROP CONSTRAINT "FK_747190c37a39feced5efcbb303f"`,
    );
    await queryRunner.query(`DROP TABLE "feedback_trainees_batch"`);
    await queryRunner.query(`DROP TABLE "question_option"`);
    await queryRunner.query(`DROP TABLE "question"`);
  }
}
