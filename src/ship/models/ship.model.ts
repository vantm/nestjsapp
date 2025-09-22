import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ShipStatus {
  Pending = 'pending',
  Active = 'active',
  Inactive = 'inactive',
  Failure = 'failure',
  Deleted = 'deleted',
}

@Entity()
export class Ship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: ShipStatus, default: ShipStatus.Pending })
  status: ShipStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  topicName: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  public completeOnboarding(topicName: string) {
    this.status = ShipStatus.Active;
    this.topicName = topicName;
  }
}
