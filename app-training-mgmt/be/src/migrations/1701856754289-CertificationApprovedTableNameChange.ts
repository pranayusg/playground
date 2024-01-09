import { MigrationInterface, QueryRunner } from 'typeorm';

export class CertificationApprovedTableNameChange1701856754289
  implements MigrationInterface
{
  name = 'CertificationApprovedTableNameChange1701856754289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" DROP CONSTRAINT "FK_44cab3212ff8d8836e2434d49aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_ongoing" DROP CONSTRAINT "FK_a1ba40e7b09b293ad58bbae7069"`,
    );
    await queryRunner.query(
      `CREATE TABLE "certification_approved" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tech" character varying NOT NULL, "certification_name" character varying NOT NULL, "level" character varying NOT NULL, "cost_in_dollar" integer, CONSTRAINT "PK_bdc9f5341e3bbd6658955e48a29" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" ADD CONSTRAINT "FK_44cab3212ff8d8836e2434d49aa" FOREIGN KEY ("exam_id") REFERENCES "certification_approved"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_ongoing" ADD CONSTRAINT "FK_a1ba40e7b09b293ad58bbae7069" FOREIGN KEY ("exam_id") REFERENCES "certification_approved"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE approved_certification`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "certification_ongoing" DROP CONSTRAINT "FK_a1ba40e7b09b293ad58bbae7069"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" DROP CONSTRAINT "FK_44cab3212ff8d8836e2434d49aa"`,
    );
    await queryRunner.query(`DROP TABLE "certification_approved"`);
    await queryRunner.query(
      `ALTER TABLE "certification_ongoing" ADD CONSTRAINT "FK_a1ba40e7b09b293ad58bbae7069" FOREIGN KEY ("exam_id") REFERENCES "approved_certification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certification_achieved" ADD CONSTRAINT "FK_44cab3212ff8d8836e2434d49aa" FOREIGN KEY ("exam_id") REFERENCES "approved_certification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
