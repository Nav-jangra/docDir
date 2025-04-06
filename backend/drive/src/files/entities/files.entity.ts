import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FilesStatusEnum } from './enums/status.enum';
import { FilesVisiblityEnum } from './enums/visibility.enum';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  originalName: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column('text', { nullable: true, default: null })
  url: string;

  @Column()
  mimeType: string;

  @Column()
  user: string;

  @Column('json', { nullable: true })
  metaData: JSON;

  @Column('bigint')
  size: number = 0;

  @Column({
    type: 'enum',
    enum: FilesStatusEnum,
    default: FilesStatusEnum.Active,
  })
  status: FilesStatusEnum;

  @Column({
    type: 'enum',
    enum: FilesVisiblityEnum,
    default: FilesVisiblityEnum.PUBLIC,
  })
  visibility: FilesVisiblityEnum;
}
