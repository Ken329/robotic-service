import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../entity/User';
import { ROLE } from '../../utils/constant';

@Entity()
export class UserSession {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user' })
  @Column({ type: 'uuid' })
  user: string;

  @Column({ type: 'varchar', enum: ROLE, nullable: false })
  role: string;

  @Column({ type: 'tinyint', nullable: false, default: false })
  revoke: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
