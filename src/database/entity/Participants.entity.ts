import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Blog } from './Blog.entity';
import { Student } from './Student.entity';

@Entity()
export class Participants {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Blog, (blog) => blog.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  @Column({ type: 'uuid', nullable: false })
  blogId: string;

  @ManyToOne(() => Student, (student) => student.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  @Column({ type: 'uuid', nullable: false })
  studentId: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  attributes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
