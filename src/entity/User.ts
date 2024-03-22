import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @Column()
  center: string;

  @Column()
  role: string;

  @Column()
  nric: string;

  @Column()
  contact: string;

  @Column()
  personalEmail: string;

  @Column()
  moeEmail: string;

  @Column()
  race: string;

  @Column()
  school: string;

  @Column()
  nationality: string;
}
