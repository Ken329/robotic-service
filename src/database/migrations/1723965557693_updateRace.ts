import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateRace1723965557693 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `UPDATE student SET race = 'Indian' WHERE race = 'indian'`
    );
    await queryRunner.query(
      `UPDATE student SET race = 'Chinese' WHERE race = 'chinese'`
    );
    await queryRunner.query(
      `UPDATE student SET race = 'Malay' WHERE race = 'malay'`
    );
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `UPDATE student SET race = 'indian' WHERE race = 'Indian'`
    );
    await queryRunner.query(
      `UPDATE student SET race = 'chinese' WHERE race = 'Chinese'`
    );
    await queryRunner.query(
      `UPDATE student SET race = 'malay' WHERE race = 'Malay'`
    );
  }
}
