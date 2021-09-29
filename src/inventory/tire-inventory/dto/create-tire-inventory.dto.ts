import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateTireInventoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  itemFileId: string;

  @IsNotEmpty()
  @IsDateString({ strict: true })
  dateOfManufacture: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sellingPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  averageSellingPrice: number;


  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  purchasePrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  purchaseId: string;
}
