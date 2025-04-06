import { StatusEnum } from 'src/common/constants';
import { Permission } from "src/permissions/entities/permission.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'smallint', unsigned: true, default: 1 })
    isEditable: number;

    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'rolePermissions',
    })
    permissions: Permission[];
}


