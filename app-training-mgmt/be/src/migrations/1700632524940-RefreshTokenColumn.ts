import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshTokenColumn1700632524940 implements MigrationInterface {
  name = 'RefreshTokenColumn1700632524940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system_user" ADD "refresh_token" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system_user" DROP COLUMN "refresh_token"`,
    );
  }
}
