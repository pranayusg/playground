/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmployeeDataSeeding1695968758573 implements MigrationInterface {
  name = 'EmployeeDataSeeding1695968758573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.employee(
        emp_id, name, email, reporting_to, curr_designation, curr_client1, curr_client2, curr_client3, curr_client4, core_tech_stack, secondary_tech_stack, status, doj)
        VALUES ('CCI00206', 'Ivo Costa', 'ivo.costa@creativecapsule.com', 'CCI00334', 'Director of Development Services', '1No Client - Oversight and Other', null, null, null, 'Angular,NodeJS,.NET, SQL, ReactJS, AWS', null, 'Active', '2018-09-04 05:30:00');`,
    );
    await queryRunner.query(
      `INSERT INTO public.employee(
          emp_id, name, email, reporting_to, curr_designation, curr_client1, curr_client2, curr_client3, curr_client4, core_tech_stack, secondary_tech_stack, status, doj)
          VALUES ('CCI00502', 'Chirag Morajkar', 'chirag.morajkar@creativecapsule.com', 'CCI00206', 'Jr Software Developer', '0No client - Unassigned', null, null, null, 'Node.js, React, NestJS, Cypress, MySQL, MongoDB, PostgreSQL, TypeScript, Firebase and IoT', null, 'Active', '2023-08-07 05:30:00');`,
    );
    await queryRunner.query(
      `INSERT INTO public.employee(
          emp_id, name, email, reporting_to, curr_designation, curr_client1, curr_client2, curr_client3, curr_client4, core_tech_stack, secondary_tech_stack, status, doj)
          VALUES ('CCI00492', 'Arti Dhoot', 'arti.dhoot@creativecapsule.com', 'CCI00206', 'Software Development Trainer', '1No Client - Oversight and Other', null, null, null, 'Knowledge of various programming languages such as JavaScript, jQuery, AngularJS etc', 'Application development', 'Active', '2023-02-14 05:30:00');`,
    );
    await queryRunner.query(
      `INSERT INTO public.employee(
          emp_id, name, email, reporting_to, curr_designation, curr_client1, curr_client2, curr_client3, curr_client4, core_tech_stack, secondary_tech_stack, status, doj)
          VALUES ('CCI00376', 'Pranay Usgaonkar', 'pranay.usgaonkar@creativecapsule.com', 'CCI00206', 'Software Developer', '0No client - Unassigned', '0', '0', '0', 'React/Remix', null, 'Active', '2021-10-18 05:30:00');`,
    );
    await queryRunner.query(
      `INSERT INTO public.employee(
            emp_id, name, email, reporting_to, curr_designation, curr_client1, curr_client2, curr_client3, curr_client4, core_tech_stack, secondary_tech_stack, status, doj)
            VALUES ('CCI00222', 'Nandini Naik', 'nandini.naik@creativecapsule.com', 'CCI00003', 'Software Developer', '0No client - Unassigned', '0', '0', '0', 'ReactJS, NodeJS', null, 'Active', '2018-12-24 05:30:00');`,
    );
    await queryRunner.query(
      `INSERT INTO public.employee(
            emp_id, name, email, reporting_to, curr_designation, curr_client1, curr_client2, curr_client3, curr_client4, core_tech_stack, secondary_tech_stack, status, doj)
            VALUES ('CCI00174', 'Namita Naik', 'namita.naik@creativecapsule.com', 'CCI00133', 'Sr Software Developer', 'C2', '0', '0', '0', 'HTML, CSS, JS, Angular, React, Remix', null, 'Active', '2017-12-15 05:30:00');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
