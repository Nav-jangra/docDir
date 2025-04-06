import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AccessEnum } from './enums/access';
import { StatusEnum } from './enums/status';

@Entity()
export class Apis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 8 })
  method: string;

  @Column({ length: 32 })
  service: string;

  @Column({ length: 64 })
  entity: string;

  @Column({ length: 128, nullable: true })
  path: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.Active,
  })
  status: string;

  @Column({
    type: 'enum',
    enum: AccessEnum,
    default: AccessEnum.Authorization,
  })
  access: string;

  @Column({ length: 128, nullable: true })
  permissions: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
