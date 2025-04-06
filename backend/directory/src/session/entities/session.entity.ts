import { StatusEnum } from 'src/common/constants';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.Active,
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('date')
  expiry: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column('varchar', { nullable: true })
  device: string;

  @Column('json', { nullable: true })
  metadata: Object;
}
