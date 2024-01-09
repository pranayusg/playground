import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmployeePKChange1696483406214 implements MigrationInterface {
  name = 'EmployeePKChange1696483406214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" RENAME COLUMN "emp_id" TO "id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" RENAME COLUMN "id" TO "emp_id"`,
    );
  }
}
