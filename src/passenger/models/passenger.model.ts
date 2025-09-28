import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Voyage } from 'src/voyage/models/voyage.model';

@Entity()
export class Passenger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  fullName: string;

  voyages: Voyage[];
}
