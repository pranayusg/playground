import { MigrationInterface, QueryRunner } from 'typeorm';

export class RawAchievedColumnNameChanged1696852131466
  implements MigrationInterface
{
  name = 'RawAchievedColumnNameChanged1696852131466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "raw_achieved" RENAME COLUMN "first_name" TO "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_achieved" RENAME CONSTRAINT "PK_bde9a34fefe308dfd0752e8c39a" TO "PK_351e2786f476d69489b8743df68"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "raw_achieved" RENAME CONSTRAINT "PK_351e2786f476d69489b8743df68" TO "PK_bde9a34fefe308dfd0752e8c39a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "raw_achieved" RENAME COLUMN "name" TO "first_name"`,
    );
  }
}
