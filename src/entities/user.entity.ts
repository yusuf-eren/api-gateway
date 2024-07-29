import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export enum WorkType {
  FULL_TIME = '0',
  PART_TIME = '1',
}

export enum Gender {
  MALE = '0',
  FEMALE = '1',
  OTHER = '2',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  old_id: number;

  @Column({ unique: true, nullable: false })
  @Generated('uuid')
  guid: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column()
  identificationNumber: string;

  @Column()
  birthDate: Date;

  @Column()
  subMerchantKey: string;

  @Column({ type: 'enum', enum: WorkType })
  workType: WorkType;

  @Column({ type: 'enum', enum: Gender }) // 0 = Male , 1 = Female 2 = Other
  gender: Gender;

  @Column('boolean', { default: true })
  isSortShow: boolean;

  @Column()
  avatar: string;

  @Column()
  iban: string;

  @Column()
  cover: string;

  @Column()
  ip: string;

  @Column()
  lastLogin: Date;

  @Column('boolean', { default: false })
  emailVerification: boolean;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column()
  cardToken: string;

  @Column('text', { default: '-' })
  cardUserKey: string;

  @Column()
  resetPasswordCode: string;

  @Column()
  resetPasswordToken: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => Role, (role) => role.user)
  userRole: Role;

  @CreateDateColumn({ default: new Date() })
  createdAt: Date;

  @CreateDateColumn({ default: new Date() })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.guid = uuidv4();
    this.slug = slugify(this.firstName + ' ' + this.guid, { lower: true });
    this.createdAt = new Date(Date.now());
    this.updatedAt = new Date(Date.now());
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date(Date.now());
  }
}
