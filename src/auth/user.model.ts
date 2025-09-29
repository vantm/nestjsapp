import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  subject: string;

  @Column()
  email: string;

  @Column()
  emailVerified: boolean;

  @Column({ nullable: true })
  givenName?: string;

  @Column({ nullable: true })
  familyName?: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  enable: boolean;

  @Column({ nullable: true })
  status?: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
