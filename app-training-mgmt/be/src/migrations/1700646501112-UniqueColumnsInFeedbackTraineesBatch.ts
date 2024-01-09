import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueColumnsInFeedbackTraineesBatch1700646501112
  implements MigrationInterface
{
  name = 'UniqueColumnsInFeedbackTraineesBatch1700646501112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedback_trainees_batch" ADD CONSTRAINT "UQ_d8f542c5f634e1bb72fb4e720a6" UNIQUE ("question_id", "batch_id", "emp_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedback_trainees_batch" DROP CONSTRAINT "UQ_d8f542c5f634e1bb72fb4e720a6"`,
    );
  }
}
