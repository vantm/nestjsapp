import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/auth/models/user.model';
import { Voyage } from './voyage.model';

@Entity()
export class VoyageCrew {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  voyageId: number;

  @ManyToOne(() => User, () => VoyageCrew)
  user: User;

  @ManyToOne(() => Voyage, (voyage) => voyage.crews)
  voyage: Voyage;
}
