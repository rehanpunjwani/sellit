import { PartialType } from '@nestjs/swagger';
import { CreateItemFileDto } from './create-item-file.dto';

// export type UpdateItemFileDto = Partial<CreateItemFileDto>

export class UpdateItemFileDto extends PartialType(CreateItemFileDto) {}