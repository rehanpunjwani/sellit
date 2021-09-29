import { ApiProperty } from '@nestjs/swagger';

export class TireInventory {
  @ApiProperty({ example: 'cksap55v40000mssb41hik5dz' })
  id: string;

  @ApiProperty()
  itemFileId: string;

  @ApiProperty()
  dateOfManufacture: Date;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  sellingPrice: number;

  @ApiProperty()
  averageSellingPrice: number;

  @ApiProperty()
  purchasePrice: number;

  @ApiProperty()
  purchaseId: string;

  createdAt: Date;
  updatedAt: Date;
}
