import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Passenger } from 'src/passenger/models/passenger.model';
import { Ship } from 'src/ship/models/ship.model';
import { VoyageCrew } from './voyage-crew.model';

export enum VoyageStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Voyage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'enum', enum: VoyageStatus, default: VoyageStatus.DRAFT })
  status: VoyageStatus;

  @Column()
  shipId: number;

  @ManyToOne(() => Ship, (ship) => ship.voyages)
  @JoinColumn({ name: 'shipId' })
  ship: Ship;

  @ManyToMany(() => Passenger, (passenger) => passenger.voyages)
  @JoinTable()
  guests: Passenger[];

  @OneToMany(() => VoyageCrew, (crew) => crew.voyage)
  crews: VoyageCrew[];
}
