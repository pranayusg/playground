import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase2Entities1694083310491 implements MigrationInterface {
  name = 'Phase2Entities1694083310491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "raw_resigned_employee" ("employee" character varying NOT NULL, "employee_number" character varying NOT NULL, "email" character varying, "doj" TIMESTAMP NOT NULL, "reporting_to" character varying, "curr_grade" character varying, "curr_location" character varying, "present_city" character varying, "present_state" character varying, "curr_department" character varying, "curr_designation" character varying NOT NULL, "curr_des_for_reporting" character varying, "leaving_date" TIMESTAMP NOT NULL, "curr_client_1" character varying, "curr_client_2" character varying, "curr_client_3" character varying, "curr_client_4" character varying, "curr_experience" numeric(10,2), "curr_previous_employer_experience" numeric(10,2), "years_served_in_curr_designation" numeric(10,2), "curr_designation_since" TIMESTAMP, "curr_business_system_qualification" character varying, "curr_core_tech_stack" character varying, "curr_secondary_tech_stack" character varying, "curr_managerial_qualification" character varying, "curr_personal_interests" character varying, "employee_status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8db670095a631fb6796a44ae8ef" PRIMARY KEY ("employee_number"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "raw_active_employee" ("employee" character varying NOT NULL, "employee_number" character varying NOT NULL, "email" character varying NOT NULL, "doj" TIMESTAMP NOT NULL, "reporting_to" character varying, "curr_grade" character varying, "curr_location" character varying, "present_city" character varying, "present_state" character varying, "curr_department" character varying, "curr_designation" character varying NOT NULL, "curr_des_for_reporting" character varying NOT NULL, "leaving_date" TIMESTAMP, "curr_client_1" character varying, "curr_client_2" character varying, "curr_client_3" character varying, "curr_client_4" character varying, "curr_experience" numeric(10,2), "curr_previous_employer_experience" numeric(10,2), "years_served_in_curr_designation" numeric(10,2), "curr_designation_since" TIMESTAMP, "curr_business_system_qualification" character varying, "curr_core_tech_stack" character varying, "curr_secondary_tech_stack" character varying, "curr_managerial_qualification" character varying, "curr_personal_interests" character varying, "employee_status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_72185927af2fdfcb7b0fd270127" PRIMARY KEY ("employee_number"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "raw_active_employee"`);
    await queryRunner.query(`DROP TABLE "raw_resigned_employee"`);
  }
}
