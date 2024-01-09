import { MigrationInterface, QueryRunner } from 'typeorm';

export class DOJInEmployeeTable1695629742160 implements MigrationInterface {
  name = 'DOJInEmployeeTable1695629742160';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employee" ADD "doj" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "doj"`);
  }
}
