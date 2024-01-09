import { MigrationInterface, QueryRunner } from 'typeorm';

export class SystemUserType1700822655451 implements MigrationInterface {
  name = 'SystemUserType1700822655451';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "system_user" DROP COLUMN "type"`);
    await queryRunner.query(
      `CREATE TYPE "public"."system_user_type_enum" AS ENUM('Admin', 'Trainer', 'Trainee')`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_user" ADD "type" "public"."system_user_type_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "system_user" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."system_user_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "system_user" ADD "type" character varying`,
    );
  }
}
