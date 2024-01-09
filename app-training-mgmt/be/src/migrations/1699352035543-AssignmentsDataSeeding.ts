/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignmentsDataSeeding1699352035543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.batch(
                id,batch_title, start_date, end_date, training_coordinator, head_trainer, status, tech_topic)
                VALUES ('3a22a19d-066a-4692-bbb9-da4f04713bf6','Python basics training (TEST)', '2023-10-25', '2023-10-26', 'Lourdes Monteiro', 'Arti Dhoot', 'Completed', 'Python Basics');`,
    );

    await queryRunner.query(
      `INSERT INTO public.tech(
                    id, name)
                    VALUES ('33e4de97-d1ef-4260-a8bd-5341a5b33243', 'Python' );`,
    );
    await queryRunner.query(
      `INSERT INTO public.tech_training(
                id,topic, description,level, tech_id)
                VALUES ('80398d3b-a580-448e-99fc-b35624359a1e','Python Basics', 'Learn basics of python programming language using the udemy Course','Beginner', '33e4de97-d1ef-4260-a8bd-5341a5b33243');`,
    );
    await queryRunner.query(
      `INSERT INTO public.tech_training(
                id,topic, description,level, tech_id)
                VALUES ('9243c5f1-09b0-4c5e-bf4a-2b24a143621d','Python Intermediate', 'Learn basics of python programming language using the udemy Course','Intermediate', '33e4de97-d1ef-4260-a8bd-5341a5b33243');`,
    );
    await queryRunner.query(`INSERT INTO public.assignment_outline(
            id, topic, duration, link, rating_keys, tech_training_id)
            VALUES ('0c462a74-6b16-4f22-ab0c-b6b09fcd22b2','py-Tasks-Set-I', 5, 'Link for the assignment questions', '{"0":"rating 1","1":"rating 2","2":"rating 3"}', '80398d3b-a580-448e-99fc-b35624359a1e');
        `);
    await queryRunner.query(`INSERT INTO public.assignment_outline(
          id, topic, duration, link, rating_keys, tech_training_id)
          VALUES ('c3ef5527-7c5b-4b6b-878f-45ac52cda2a8','py-Tasks-Set-II', 10, 'Link for the assignment questions', '{"0":"rating 1","1":"rating 2","2":"rating 3"}', '80398d3b-a580-448e-99fc-b35624359a1e');
      `);
    await queryRunner.query(`INSERT INTO public.batch_assignment_outline(
            id,start_date, end_date, assignment_outline_id, batch_id)
           VALUES ('5d0a4ee6-7ea3-445c-8380-5ec1590e14a6','2023-10-25', '2023-10-26', '0c462a74-6b16-4f22-ab0c-b6b09fcd22b2', '3a22a19d-066a-4692-bbb9-da4f04713bf6');`);
    await queryRunner.query(`INSERT INTO public.batch_assignment_outline(
            id,start_date, end_date, assignment_outline_id, batch_id)
           VALUES ('76e167df-bf45-4798-acff-be39e5607dd6','2023-10-25', '2023-10-26', 'c3ef5527-7c5b-4b6b-878f-45ac52cda2a8', '3a22a19d-066a-4692-bbb9-da4f04713bf6');`);
    await queryRunner.query(`INSERT INTO public.feedback_assignment(
            ratings, overall_rating, comment, submission_date, status, batch_assignment_outline_id, emp_id)
            VALUES ('{"rating 1":"4","rating 2":"3","rating 3":"5"}', 'Good performance', 'Some additional comment', '2023-10-25', 'Submitted', '5d0a4ee6-7ea3-445c-8380-5ec1590e14a6', 'CCI00502');`);
    await queryRunner.query(`INSERT INTO public.feedback_assignment(
              ratings, overall_rating, comment, submission_date, status, batch_assignment_outline_id, emp_id)
              VALUES ('{"rating 1":"4","rating 2":"3","rating 3":"5"}', 'Good performance', 'Some additional comment', '2023-10-25', 'Submitted', '76e167df-bf45-4798-acff-be39e5607dd6', 'CCI00502');`);
    await queryRunner.query(`INSERT INTO public.feedback_assignment(
                ratings, overall_rating, comment, submission_date, status, batch_assignment_outline_id, emp_id)
                VALUES ('{"rating 1":"4","rating 2":"3","rating 3":"5"}', 'Good performance', 'Some additional comment', '2023-10-25', 'Submitted', '5d0a4ee6-7ea3-445c-8380-5ec1590e14a6', 'CCI00206');`);
    await queryRunner.query(`INSERT INTO public.feedback_assignment(
                  ratings, overall_rating, comment, submission_date, status, batch_assignment_outline_id, emp_id)
                  VALUES ('{"rating 1":"4","rating 2":"3","rating 3":"5"}', 'Good performance', 'Some additional comment', '2023-10-25', 'Submitted', '76e167df-bf45-4798-acff-be39e5607dd6', 'CCI00206');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
