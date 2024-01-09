import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase4Entities1695015048826 implements MigrationInterface {
  name = 'Phase4Entities1695015048826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "batch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batch_title" character varying NOT NULL, "tech" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "training_coordinator" character varying NOT NULL, "head_trainer" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_57da3b830b57bec1fd329dcaf43" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "training_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "emp_id" character varying, "batch_id" uuid, CONSTRAINT "PK_81a2089f4253034410bccacd3eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "certification_ongoing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_date" TIMESTAMP NOT NULL, "expected_end_date" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "when" character varying NOT NULL, "what" character varying NOT NULL, "emp_id" character varying, "exam_id" uuid, CONSTRAINT "PK_c23a39f84e91ec0485b078b1bf0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."employee_status_enum" AS ENUM('Active', 'Resigned', 'Exit')`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee" ("emp_id" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying, "reporting_to" character varying, "curr_designation" character varying NOT NULL, "curr_client1" character varying, "curr_client2" character varying, "curr_client3" character varying, "curr_client4" character varying, "core_tech_stack" character varying, "secondary_tech_stack" character varying, "status" "public"."employee_status_enum" NOT NULL DEFAULT 'Active', CONSTRAINT "PK_1d437182cba7606e234a508771c" PRIMARY KEY ("emp_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "certification_achieved" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "achieved_date" TIMESTAMP NOT NULL, "expiry_date" TIMESTAMP, "certification_link" character varying, "emp_id" character varying, "exam_id" uuid, CONSTRAINT "PK_86159ed4f6e80dce1e7eca2517b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "approved_certification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tech" character varying NOT NULL, "certification_name" character varying NOT NULL, "level" character varying NOT NULL, "cost_in_dollar" integer, CONSTRAINT "PK_74c76599767b412aff7a77bb21b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "training_detail" ADD CONSTRAINT "FK_31661d60063a879e3a197f0bd7a" FOREIGN KEY ("emp_id") REFERENCES "employee"("emp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "training_detail" ADD CONSTRAINT "FK_824d69193a6a4146b8b2c4fbff2" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_ongoing" ADD CONSTRAINT "FK_e040d9d57e4474471c3c932abc0" FOREIGN KEY ("emp_id") REFERENCES "employee"("emp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_ongoing" ADD CONSTRAINT "FK_a1ba40e7b09b293ad58bbae7069" FOREIGN KEY ("exam_id") REFERENCES "approved_certification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" ADD CONSTRAINT "FK_b67e5538aa64d2bdcfc8681c7fe" FOREIGN KEY ("emp_id") REFERENCES "employee"("emp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" ADD CONSTRAINT "FK_44cab3212ff8d8836e2434d49aa" FOREIGN KEY ("exam_id") REFERENCES "approved_certification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" DROP CONSTRAINT "FK_44cab3212ff8d8836e2434d49aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" DROP CONSTRAINT "FK_b67e5538aa64d2bdcfc8681c7fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_ongoing" DROP CONSTRAINT "FK_a1ba40e7b09b293ad58bbae7069"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_ongoing" DROP CONSTRAINT "FK_e040d9d57e4474471c3c932abc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "training_detail" DROP CONSTRAINT "FK_824d69193a6a4146b8b2c4fbff2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "training_detail" DROP CONSTRAINT "FK_31661d60063a879e3a197f0bd7a"`,
    );
    await queryRunner.query(`DROP TABLE "approved_certification"`);
    await queryRunner.query(`DROP TABLE "certification_achieved"`);
    await queryRunner.query(`DROP TABLE "employee"`);
    await queryRunner.query(`DROP TYPE "public"."employee_status_enum"`);
    await queryRunner.query(`DROP TABLE "certification_ongoing"`);
    await queryRunner.query(`DROP TABLE "training_detail"`);
    await queryRunner.query(`DROP TABLE "batch"`);
  }
}
