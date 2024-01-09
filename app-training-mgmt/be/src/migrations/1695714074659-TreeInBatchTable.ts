import { MigrationInterface, QueryRunner } from 'typeorm';

export class TreeInBatchTable1695714074659 implements MigrationInterface {
  name = 'TreeInBatchTable1695714074659';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "batch" ADD "mpath" character varying DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "batch" ADD "parentId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "batch" ADD CONSTRAINT "FK_2340267eec8b829f207bd8d2bf4" FOREIGN KEY ("parentId") REFERENCES "batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "batch" DROP CONSTRAINT "FK_2340267eec8b829f207bd8d2bf4"`,
    );
    await queryRunner.query(`ALTER TABLE "batch" DROP COLUMN "parentId"`);
    await queryRunner.query(`ALTER TABLE "batch" DROP COLUMN "mpath"`);
  }
}
