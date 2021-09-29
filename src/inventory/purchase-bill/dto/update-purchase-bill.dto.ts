import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseBillDto } from './create-purchase-bill.dto';

export class UpdatePurchaseBillDto extends PartialType(CreatePurchaseBillDto) {}
