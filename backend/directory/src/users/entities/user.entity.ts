import { GenderEnum, StatusEnum } from 'src/common/constants';
import { Role } from 'src/roles/entities/role.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
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

    @ManyToOne(() => Role)
    @JoinColumn()
    role: Role;

    @Column('text', { nullable: true })
    phone: string;

    @Column('text')
    email: string;

    @Column('varchar', { nullable: true })
    password: string;

    @Column('varchar', { nullable: true })
    fullname: string;

    @Column('varchar', { nullable: true })
    pic: string;

    @Column('json', { nullable: true })
    metadata: Object;

    @Column({
        type: 'enum',
        enum: GenderEnum,
        default: GenderEnum.None,
    })
    gender: string;
}

