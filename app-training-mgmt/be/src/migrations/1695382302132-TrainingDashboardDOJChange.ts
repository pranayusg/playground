import { MigrationInterface, QueryRunner } from 'typeorm';

export class TrainingDashboardDOJChange1695382302132
  implements MigrationInterface
{
  name = 'TrainingDashboardDOJChange1695382302132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" DROP CONSTRAINT "PK_88a372d838e20ca8296d1af9159"`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" ADD CONSTRAINT "PK_ab87918514f93932d3712cc6c49" PRIMARY KEY ("emp_id", "type_of_training", "batche_type", "batch_type_description")`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" ALTER COLUMN "doj" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" DROP CONSTRAINT "PK_ab87918514f93932d3712cc6c49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" ADD CONSTRAINT "PK_88a372d838e20ca8296d1af9159" PRIMARY KEY ("doj", "emp_id", "type_of_training", "batche_type", "batch_type_description")`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" ALTER COLUMN "doj" SET NOT NULL`,
    );
  }
}
