import { ApiProperty } from '@nestjs/swagger';
import { TireBrand, TireMade, TirePattern, TireSize } from '@prisma/client';

export class TireItemFile {
  @ApiProperty({ example: 'cksap55v40000mssb41hik5dz' })
  id: string;

  @ApiProperty({ enum: TireBrand })
  brand: TireBrand;

  @ApiProperty({ enum: TireSize })
  size: TireSize;

  @ApiProperty({ enum: TirePattern })
  pattern: TirePattern;

  @ApiProperty({ enum: TireMade })
  made: TireMade;

  createdAt: Date;

  updatedAt: Date;
}
