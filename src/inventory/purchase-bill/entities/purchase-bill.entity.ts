import { ApiProperty } from '@nestjs/swagger';

export class PurchaseBill {
  @ApiProperty({ example: 'cksap55v40000mssb41hik5dz' })
  id: string;

  @ApiProperty()
  totalCost: number;

  @ApiProperty({ nullable: true })
  advancePaid?: number;

  @ApiProperty()
  tireQuantity: number;

  @ApiProperty()
  costPaid: number;

  @ApiProperty()
  vendor_id: string;

  @ApiProperty({ nullable: true })
  nextPaymentDate?: Date;

  @ApiProperty({ nullable: true })
  nextPaymentAmount?: number;

  createdAt: Date;
  updatedAt: Date;
}
