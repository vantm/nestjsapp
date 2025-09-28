import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  action: string;

  @Column({ length: 50 })
  resource: string;

  @Column({ length: 200, nullable: true })
  conditions?: string;
}
