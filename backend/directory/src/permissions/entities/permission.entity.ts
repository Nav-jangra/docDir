import { StatusEnum } from 'src/common/constants';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('varchar')
    entity: string;

    @Column('varchar')
    action: string;

    @Column({
        type: 'enum',
        enum: StatusEnum,
        default: StatusEnum.Active,
    })
    status: string;
}
