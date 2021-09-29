import { ApiProperty } from '@nestjs/swagger';

export class Vendor {
  @ApiProperty({ example: 'cksap55v40000mssb41hik5dz' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description?: string;

  createdAt: Date;
  updatedAt: Date;
}
