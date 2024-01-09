import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingAuditingEntity1696480456870 implements MigrationInterface {
  name = 'AddingAuditingEntity1696480456870';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "approved_certification" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "approved_certification" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "training_detail" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "training_detail" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "batch" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "batch" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "batch" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "training_detail" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "training_detail" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "approved_certification" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "approved_certification" DROP COLUMN "created_at"`,
    );
  }
}
