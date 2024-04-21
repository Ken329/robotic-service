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
import { Center } from './Center';
import { Student } from './Student';
import { ROLE, USER_STATUS } from '../../utils/constant';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', enum: ROLE, nullable: false })
  role: string;

  @Column({ type: 'varchar', enum: USER_STATUS, nullable: false })
  status: string;

  @ManyToOne(() => Center, (center) => center.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'center' })
  @Column({ type: 'uuid', nullable: true })
  center: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Student, (student) => student.user)
  student: Student;
}
