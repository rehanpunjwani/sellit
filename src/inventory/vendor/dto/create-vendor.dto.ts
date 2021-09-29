import { ApiProperty } from '@nestjs/swagger';
import { VendorType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateVendorDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  description?: string;

  @IsNotEmpty()
  @IsEnum(VendorType)
  @ApiProperty({ enum: VendorType })
  type: VendorType;

}