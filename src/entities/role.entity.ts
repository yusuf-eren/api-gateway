import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

// 1 = user, 2 = psychologist, 3 = author, 4 = admin
export enum Roles {
  role_1 = '1',
  role_2 = '2',
  role_3 = '3',
  role_4 = '4',
}

@Entity('user_roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: Roles, nullable: false })
  role: string;

  @OneToMany(() => User, (user) => user.userRole)
  user: User[];
}
