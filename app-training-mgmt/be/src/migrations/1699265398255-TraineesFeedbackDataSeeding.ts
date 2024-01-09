/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TraineesFeedbackDataSeeding1699265398255
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO public.question(
        id,question_text, question_type)
        VALUES ('e5192e09-968f-4256-b799-01dcaed82e23','Trainer was well prepared for the training.', 'mcq');`);
    await queryRunner.query(`INSERT INTO public.question(
        id,question_text, question_type)
        VALUES ('8f37fd6f-b0c9-4353-8469-9f5bcb0c6a96','Training speed was just right.', 'mcq');`);
    await queryRunner.query(`INSERT INTO public.question(
        id,question_text, question_type)
        VALUES ('f74be4b0-aec2-4fe2-93a3-efb42d577017','Training content was just right for me.', 'mcq');`);
    await queryRunner.query(`INSERT INTO public.question(
        id,question_text, question_type)
        VALUES ('fed7d548-3aed-4ea4-87ad-891b95f69e58','Training duration was perfect.', 'mcq');`);
    await queryRunner.query(`INSERT INTO public.question(
        id,question_text, question_type)
        VALUES ('4b50f2c2-8209-4437-8e7e-cb98c70a2f9b','Is there anything else that you would like to share about your training experience?', 'text');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Strongly agree', 1, 'e5192e09-968f-4256-b799-01dcaed82e23');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Agree', 2, 'e5192e09-968f-4256-b799-01dcaed82e23');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Neutral', 3, 'e5192e09-968f-4256-b799-01dcaed82e23');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Disagree', 4, 'e5192e09-968f-4256-b799-01dcaed82e23');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Strongly disagree', 5, 'e5192e09-968f-4256-b799-01dcaed82e23');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Strongly agree', 1, '8f37fd6f-b0c9-4353-8469-9f5bcb0c6a96');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Agree', 2, '8f37fd6f-b0c9-4353-8469-9f5bcb0c6a96');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Neutral', 3, '8f37fd6f-b0c9-4353-8469-9f5bcb0c6a96');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Disagree', 4, '8f37fd6f-b0c9-4353-8469-9f5bcb0c6a96');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Strongly disagree', 5, '8f37fd6f-b0c9-4353-8469-9f5bcb0c6a96');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Strongly agree', 1, 'f74be4b0-aec2-4fe2-93a3-efb42d577017');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Agree', 2, 'f74be4b0-aec2-4fe2-93a3-efb42d577017');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Neutral', 3, 'f74be4b0-aec2-4fe2-93a3-efb42d577017');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Disagree', 4, 'f74be4b0-aec2-4fe2-93a3-efb42d577017');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Strongly disagree', 5, 'f74be4b0-aec2-4fe2-93a3-efb42d577017');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Strongly agree', 1, 'fed7d548-3aed-4ea4-87ad-891b95f69e58');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Agree', 2, 'fed7d548-3aed-4ea4-87ad-891b95f69e58');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Neutral', 3, 'fed7d548-3aed-4ea4-87ad-891b95f69e58');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Disagree', 4, 'fed7d548-3aed-4ea4-87ad-891b95f69e58');`);
    await queryRunner.query(`INSERT INTO public.question_option(
        option_text, "order", question_id)
        VALUES ('Strongly disagree', 5, 'fed7d548-3aed-4ea4-87ad-891b95f69e58');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
