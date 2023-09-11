import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase2Entities1694068575380 implements MigrationInterface {
  name = 'Phase2Entities1694068575380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "raw_resigned_employee" ("employee" character varying NOT NULL, "employee_number" character varying NOT NULL, "email" character varying NOT NULL, "doj" TIMESTAMP NOT NULL, "reporting_to" character varying, "curr_grade" character varying NOT NULL, "curr_location" character varying NOT NULL, "present_city" character varying NOT NULL, "present_state" character varying NOT NULL, "curr_department" character varying NOT NULL, "curr_designation" character varying NOT NULL, "curr_des_for_reporting" character varying NOT NULL, "leaving_date" TIMESTAMP NOT NULL, "curr_client_1" character varying NOT NULL, "curr_client_2" character varying, "curr_client_3" character varying, "curr_client_4" character varying, "curr_experience" integer NOT NULL, "curr_previous_employer_experience" integer, "years_served_in_curr_designation" integer NOT NULL, "curr_designation_since" TIMESTAMP, "curr_business_system_qualification" character varying, "curr_core_tech_stack" character varying, "curr_secondary_tech_stack" character varying, "curr_managerial_qualification" character varying, "curr_personal_interests" character varying, "employee_status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8db670095a631fb6796a44ae8ef" PRIMARY KEY ("employee_number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "raw_active_employee" ("employee" character varying NOT NULL, "employee_number" character varying NOT NULL, "email" character varying NOT NULL, "doj" TIMESTAMP NOT NULL, "reporting_to" character varying NOT NULL, "curr_grade" character varying NOT NULL, "curr_location" character varying NOT NULL, "present_city" character varying NOT NULL, "present_state" character varying NOT NULL, "curr_department" character varying NOT NULL, "curr_designation" character varying NOT NULL, "curr_des_for_reporting" character varying NOT NULL, "leaving_date" TIMESTAMP, "curr_client_1" character varying NOT NULL, "curr_client_2" character varying, "curr_client_3" character varying, "curr_client_4" character varying, "curr_experience" integer NOT NULL, "curr_previous_employer_experience" integer, "years_served_in_curr_designation" integer NOT NULL, "curr_designation_since" TIMESTAMP, "curr_business_system_qualification" character varying, "curr_core_tech_stack" character varying NOT NULL, "curr_secondary_tech_stack" character varying, "curr_managerial_qualification" character varying, "curr_personal_interests" character varying, "employee_status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_72185927af2fdfcb7b0fd270127" PRIMARY KEY ("employee_number"))`,
    );
    await queryRunner.query(`INSERT INTO public.raw_active_employee(
        employee, employee_number, email, doj, reporting_to, curr_grade, curr_location, present_city, present_state, curr_department, curr_designation, curr_des_for_reporting, leaving_date, curr_client_1, curr_client_2, curr_client_3, curr_client_4, curr_experience, curr_previous_employer_experience, years_served_in_curr_designation, curr_designation_since, curr_business_system_qualification, curr_core_tech_stack, curr_secondary_tech_stack, curr_managerial_qualification, curr_personal_interests, employee_status, created_at, updated_at)
        VALUES ('Abhijit Naik', 'CCI00267', 'abhijit.naik@creativecapsule.com', '03-Feb-20', 'Sumit Jadhav', 'Staff', 'Goa', 'Ponda', 'Goa', 'Eng - QA', 'Sr QA Engineer', 'QA Engineer 3 Senior', null, 'Novel', '0', '0', '0', 3.06, 3, 1.07, '01-01-2022', '', 'Manual QA', '', '','', 'Active', '01-01-01', '01-01-01');`);
    await queryRunner.query(`INSERT INTO public.raw_active_employee(
        employee, employee_number, email, doj, reporting_to, curr_grade, curr_location, present_city, present_state, curr_department, curr_designation, curr_des_for_reporting, leaving_date, curr_client_1, curr_client_2, curr_client_3, curr_client_4, curr_experience, curr_previous_employer_experience, years_served_in_curr_designation, curr_designation_since, curr_business_system_qualification, curr_core_tech_stack, curr_secondary_tech_stack, curr_managerial_qualification, curr_personal_interests, employee_status, created_at, updated_at)
        VALUES ('ABC Test Employee', 'CCI00300', 'test.test@creativecapsule.com', '05-Oct-21', 'Sumit Jadhav', 'Staff', 'Goa', 'Margao', 'Goa', 'Eng - Dev', 'Jr Developer', 'QA Engineer 3 Junior', null, 'Test', '0', '0', '0', 1.06,23, 0.07, '02-02-2021', '', 'Manual QA', '', '','', 'Active', '01-01-01', '01-01-01');`);
    await queryRunner.query(`INSERT INTO public.raw_resigned_employee(
        employee, employee_number, email, doj, reporting_to, curr_grade, curr_location, present_city, present_state, curr_department, curr_designation, curr_des_for_reporting, leaving_date, curr_client_1, curr_client_2, curr_client_3, curr_client_4, curr_experience, curr_previous_employer_experience, years_served_in_curr_designation, curr_designation_since, curr_business_system_qualification, curr_core_tech_stack, curr_secondary_tech_stack, curr_managerial_qualification, curr_personal_interests, employee_status, created_at, updated_at)
        VALUES ('Aamod Talauliker', 'CCI00149', 'aamod.talauliker@creativecapsule.com', '06-Jun-17', 'Sumit Jadhav', 'Staff', 'Goa', 'Margao', 'Goa', 'Eng Dev - Backend', 'Software Developer', 'Software Developer 2', '10-Mar-22', 'GiSC', '', '', '', 4.09, null, 4.01, '01-Jul-19', '', '', '', '', '', 'Resigned', '01-01-01', '01-01-01');                                                                                                 
    `);
    await queryRunner.query(`INSERT INTO public.raw_resigned_employee(
        employee, employee_number, email, doj, reporting_to, curr_grade, curr_location, present_city, present_state, curr_department, curr_designation, curr_des_for_reporting, leaving_date, curr_client_1, curr_client_2, curr_client_3, curr_client_4, curr_experience, curr_previous_employer_experience, years_served_in_curr_designation, curr_designation_since, curr_business_system_qualification, curr_core_tech_stack, curr_secondary_tech_stack, curr_managerial_qualification, curr_personal_interests, employee_status, created_at, updated_at)
        VALUES ('Test Talauliker', 'CCI00150', 'test.talauliker@creativecapsule.com', '01-Aug-18', 'Sumit Tets', 'Staff', 'Goa', 'Panajim', 'Goa', 'Eng Dev - Backend', 'Software Developer', 'Software Developer 2', '10-Mar-22', 'GiSC', '', '', '', 4.09, null, 4.01, '01-Jul-19', '', '', '', '', '', 'Resigned', '01-01-01', '01-01-01');                                                                                                 
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "raw_active_employee"`);
    await queryRunner.query(`DROP TABLE "raw_resigned_employee"`);
  }
}