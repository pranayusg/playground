import { MigrationInterface, QueryRunner } from 'typeorm';

export class TrainingDashboardEntityChanges1695385044638
  implements MigrationInterface
{
  name = 'TrainingDashboardEntityChanges1695385044638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" DROP CONSTRAINT "PK_ab87918514f93932d3712cc6c49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" ADD CONSTRAINT "PK_f912bcc111eecc9abe044df7e33" PRIMARY KEY ("emp_id", "name", "type_of_training", "batche_type", "batch_type_description")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" DROP CONSTRAINT "PK_f912bcc111eecc9abe044df7e33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" ADD CONSTRAINT "PK_ab87918514f93932d3712cc6c49" PRIMARY KEY ("emp_id", "type_of_training", "batche_type", "batch_type_description")`,
    );
  }
}
