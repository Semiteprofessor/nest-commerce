import { UUID } from 'crypto';
import { Roles } from 'src/utiltiy/common/user-roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: UUID;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  @Column({ type: 'enum', enum: Roles, default: [Roles.USER] })
  role: Roles[];
  @CreateDateColumn()
  created_at: Timestamp;
  @CreateDateColumn()
  updated_at: Timestamp;
  //   @Column({ default: false })
  //   isActive: boolean;
}
