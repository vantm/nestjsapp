import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Passenger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  fullName: string;
}
