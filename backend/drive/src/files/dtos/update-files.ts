import { PartialType } from '@nestjs/swagger';
import { CreateFileDto } from './create-files';

export class UpdateFileDto extends PartialType(CreateFileDto) { }
