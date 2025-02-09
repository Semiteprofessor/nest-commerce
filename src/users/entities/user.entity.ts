import { Roles } from 'src/utiltiy/common/user-roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column({ select: false })
  password: string;
  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  role: Roles[];
  // @CreateDateColumn()
  // createdAt: Date;
  // @CreateDateColumn()
  // updatedAt: Date;
  //   @Column({ default: false })
  //   isActive: boolean;
}
