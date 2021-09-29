import { PartialType } from '@nestjs/swagger';
import { CreateTireInventoryDto } from './create-tire-inventory.dto';

export class UpdateTireInventoryDto extends PartialType(
  CreateTireInventoryDto
) {}
