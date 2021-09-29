import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreatePurchaseBillDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalCost: number;

  @ApiProperty()
  @IsNumber()
  advancePaid: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tireQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  costPaid: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vendor_id: string;

  @ApiProperty()
  @IsDateString({ strict: true })
  nextPaymentDate?: Date;

  @ApiProperty()
  @IsNumber()
  nextPaymentAmount?: number;

}

