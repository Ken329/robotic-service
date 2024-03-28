import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Center } from './Center';
import { ROLE, USER_STATUS, RELATIONSHIP, GENDER } from '../../utils/constant';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', enum: USER_STATUS, nullable: false })
  status: string;

  @Column({ type: 'varchar', enum: ROLE, nullable: false })
  role: string;

  @ManyToOne(() => Center, (center) => center.id)
  @JoinColumn({ name: 'center' })
  @Column({ type: 'uuid', nullable: true })
  center: string;

  @Column({ nullable: true })
  nric: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ type: 'varchar', enum: GENDER, nullable: true })
  gender: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  moeEmail: string;

  @Column({ nullable: true })
  race: string;

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  parentName: string;

  @Column({ type: 'varchar', enum: RELATIONSHIP, nullable: true })
  relationship: string;

  @Column({ nullable: true })
  parentEmail: string;

  @Column({ nullable: true })
  parentContact: string;

  @Column({ type: 'varchar', enum: ROLE, nullable: true })
  rejectedBy: string;
}
