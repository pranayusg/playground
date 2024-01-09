import { MigrationInterface, QueryRunner } from 'typeorm';

export class EvaluationCriteriaTable1701068750880
  implements MigrationInterface
{
  name = 'EvaluationCriteriaTable1701068750880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "evaluation_criteria" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_1bf12cd7c46af786eec5987c5c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO evaluation_criteria(name) VALUES ('Architecture'),('UI'),('Clean Code'),('Naming convention'),('Code Working?');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "evaluation_criteria"`);
  }
}
