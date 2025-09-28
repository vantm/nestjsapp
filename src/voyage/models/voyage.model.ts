import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/auth/user.model';
import { Passenger } from 'src/passenger/models/passenger.model';
import { Ship } from 'src/ship/models/ship.model';

@Entity()
export class Voyage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column()
  shipId: number;

  @ManyToOne(() => Ship, (ship) => ship.voyages)
  @JoinColumn({ name: 'shipId' })
  ship: Ship;

  @ManyToMany(() => Passenger, (passenger) => passenger.voyages)
  @JoinTable()
  guests: Passenger[];

  @ManyToMany(() => User)
  @JoinTable()
  crews: User[];
}
