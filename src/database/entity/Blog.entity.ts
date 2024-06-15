import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { File } from './File.entity';
import { BLOG_TYPE, BLOG_CATEGORY } from '../../utils/constant';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'varchar', enum: BLOG_CATEGORY, nullable: false })
  category: string;

  @Column({ type: 'varchar', enum: BLOG_TYPE, nullable: false })
  type: string;

  @Column({ nullable: false })
  assigned: string;

  @ManyToOne(() => File, (file) => file.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coverImage' })
  @Column({ type: 'uuid', nullable: false })
  coverImage: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: false })
  content: string;

  @Column({ nullable: false, default: 0 })
  views: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
