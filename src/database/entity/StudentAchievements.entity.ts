import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Student } from './Student.entity';
import { Achievement } from './Achievement.entity';

@Entity()
export class StudentAchievements {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.id, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'student' })
  @Column({ type: 'uuid' })
  student: string;

  @ManyToOne(() => Achievement, (achievement) => achievement.id, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'achievement' })
  @Column({ type: 'uuid' })
  achievement: string;

  @CreateDateColumn()
  createdAt: Date;
}
