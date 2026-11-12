import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateStudentExpiryDate1762916000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `UPDATE student SET expiryDate = '2026-11-15' WHERE user = '692AF51C-70B1-7048-F6AE-7DC214D87EB2' AND expiryDate = '2026-12-31'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `UPDATE student SET expiryDate = '2026-12-31' WHERE user = '692AF51C-70B1-7048-F6AE-7DC214D87EB2' AND expiryDate = '2026-11-15'`
    );
  }
}
