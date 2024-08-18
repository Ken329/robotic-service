import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateOthersRace1723971531137 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `UPDATE student SET race = 'Others' WHERE race = 'others'`
    );
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `UPDATE student SET race = 'others' WHERE race = 'Others'`
    );
  }
}
