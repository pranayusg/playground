import { MigrationInterface, QueryRunner } from 'typeorm';

export class FlagInBatchTable1700647079010 implements MigrationInterface {
  name = 'FlagInBatchTable1700647079010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "batch" ADD "form_generated" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "batch" DROP COLUMN "form_generated"`);
  }
}
