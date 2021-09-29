import { ApiProperty } from '@nestjs/swagger';
import { TireBrand, TireMade, TirePattern, TireSize } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

// export type CreateItemFileDto = Omit<TireItemFile, 'createdAt' | 'updatedAt' | 'id'>;

export class CreateItemFileDto {
  @ApiProperty({ enum: TireBrand })
  @IsNotEmpty()
  @IsEnum(TireBrand)
  brand: TireBrand;

  @IsNotEmpty()
  @IsEnum(TireSize)
  @ApiProperty({ enum: TireSize })
  size: TireSize;

  @IsNotEmpty()
  @IsEnum(TirePattern)
  @ApiProperty({ enum: TirePattern })
  pattern: TirePattern;

  @IsNotEmpty()
  @IsEnum(TireMade)
  @ApiProperty({ enum: TireMade })
  made: TireMade;
}
