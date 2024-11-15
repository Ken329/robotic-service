import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateStatusConstraints1723971531138
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE user DROP CONSTRAINT CHK_STATUS_ENUM;`
    );
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE user ADD CONSTRAINT CHK_STATUS_ENUM CHECK ([status]='expired' OR [status]='rejected' OR [status]='approved' OR [status]='pending admin' OR [status]='pending center' OR [status]='pending verification OR [status]='retired');`
    );
  }
}
