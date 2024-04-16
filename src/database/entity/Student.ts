import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './User';
import { ROLE, GENDER, RELATIONSHIP } from '../../utils/constant';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user' })
  @Column({ type: 'uuid' })
  user: string;

  @Column({ nullable: true })
  nric: string;

  @Column({ nullable: true })
  passport: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  moeEmail: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ type: 'varchar', enum: GENDER, nullable: false })
  gender: string;

  @Column({ nullable: false })
  dob: string;

  @Column({ nullable: false })
  race: string;

  @Column({ nullable: false })
  school: string;

  @Column({ nullable: false })
  nationality: string;

  @Column({ nullable: false })
  parentName: string;

  @Column({ type: 'varchar', enum: RELATIONSHIP, nullable: false })
  relationship: string;

  @Column({ nullable: false })
  parentEmail: string;

  @Column({ nullable: false })
  parentContact: string;

  @Column({ type: 'varchar', enum: ROLE, nullable: true })
  rejectedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
