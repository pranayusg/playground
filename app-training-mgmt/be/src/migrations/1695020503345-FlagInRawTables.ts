import { MigrationInterface, QueryRunner } from 'typeorm';

export class FlagInRawTables1695020503345 implements MigrationInterface {
  name = 'FlagInRawTables1695020503345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "raw_achieved" ADD "is_processed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_ongoing" ADD "is_processed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_resigned_employee" ADD "is_processed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_approved_certification" ADD "is_processed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_active_employee" ADD "is_processed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_batch" ALTER COLUMN "is_processed" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_batch" ALTER COLUMN "is_processed" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" ALTER COLUMN "is_processed" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" ALTER COLUMN "is_processed" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" ALTER COLUMN "is_processed" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_training_dashboard" ALTER COLUMN "is_processed" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_batch" ALTER COLUMN "is_processed" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_batch" ALTER COLUMN "is_processed" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_active_employee" DROP COLUMN "is_processed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_approved_certification" DROP COLUMN "is_processed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_resigned_employee" DROP COLUMN "is_processed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_ongoing" DROP COLUMN "is_processed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_achieved" DROP COLUMN "is_processed"`,
    );
  }
}
