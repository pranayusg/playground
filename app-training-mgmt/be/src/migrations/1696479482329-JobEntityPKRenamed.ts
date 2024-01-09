import { MigrationInterface, QueryRunner } from 'typeorm';

export class JobEntityPKRenamed1696479482329 implements MigrationInterface {
  name = 'JobEntityPKRenamed1696479482329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "job" RENAME COLUMN "job_id" TO "id"`);
    await queryRunner.query(
      `ALTER TABLE "job" RENAME CONSTRAINT "PK_25526336589e1d6f5b5d9c5b74b" TO "PK_98ab1c14ff8d1cf80d18703b92f"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job" RENAME CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" TO "PK_25526336589e1d6f5b5d9c5b74b"`,
    );
    await queryRunner.query(`ALTER TABLE "job" RENAME COLUMN "id" TO "job_id"`);
  }
}
