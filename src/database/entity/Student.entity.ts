import {
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './User.entity';
import { Level } from './Level.entity';
import { ROLE, GENDER, RELATIONSHIP, TSHIRT_SIZE } from '../../utils/constant';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  @Column({ type: 'uuid' })
  user: string;

  @Column({ nullable: true })
  roboticId: string;

  @ManyToOne(() => Level, (level) => level.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'level' })
  @Column({ type: 'uuid', nullable: true })
  level: string;

  @Column({ nullable: true })
  nric: string;

  @Column({ nullable: true })
  passport: string;

  @Column({ nullable: true })
  personalEmail: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ type: 'varchar', enum: TSHIRT_SIZE, nullable: false })
  size: string;

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

  @Column({ type: 'tinyint', nullable: false, default: false })
  parentConsent: boolean;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'varchar', enum: ROLE, nullable: true })
  rejectedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
