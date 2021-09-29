import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PurchaseBillService } from '../purchase-bill/purchase-bill.service';
import { CreateTireInventoryDto } from './dto/create-tire-inventory.dto';
import { UpdateTireInventoryDto } from './dto/update-tire-inventory.dto';
import { TireInventory } from './entities/tire-inventory.entity';
import { TireInventoryService } from './tire-inventory.service';

@ApiTags('Tire Inventory')
@Controller('tire-inventory')
export class TireInventoryController {
  constructor(private readonly tireInventoryService: TireInventoryService, private readonly purchaseBillService: PurchaseBillService) { }

  @ApiOkResponse({
    type: TireInventory,
    description: 'create a  new tire inventory entity',
  })
  @Post()
  async create(@Body() createTireInventoryDto: CreateTireInventoryDto) {
    const remaining = await this.purchaseBillService.getRemainingTires(createTireInventoryDto.purchaseId);
    if (createTireInventoryDto.quantity > remaining) {
      throw new BadRequestException("the quantity cannot exceed the total tires in purchase bill")
    }
    return this.tireInventoryService.create(createTireInventoryDto);
  }

  @ApiOkResponse({
    type: TireInventory,
    description: 'get all the tire inventory entities',
  })
  @Get()
  findAll() {
    return this.tireInventoryService.findAll();
  }


  @ApiOkResponse({
    type: TireInventory,
    description: 'get the total no of tires',
  })
  @Get('/total')
  getTotalTires() {
    return this.tireInventoryService.getTotalTires();
  }

  @ApiOkResponse({
    type: TireInventory,
    description: 'get the tire inventory entity by given id',
  })

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tireInventoryService.findOne(id);
  }

  @ApiOkResponse({
    type: TireInventory,
    description: 'update the tire inventory entity by given id',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTireInventoryDto: UpdateTireInventoryDto
  ) {
    return this.tireInventoryService.update(id, updateTireInventoryDto);
  }

  @ApiOkResponse({
    type: TireInventory,
    description: 'delete the tire inventory entity by given id',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tireInventoryService.remove(id);
  }

  @ApiOkResponse({
    type: TireInventory,
    description: 'get the total quantity of tires for a  given purchase id',
  })
  @Get('/quantity-purchase/:id')
  totalQuantity(@Param('id') purchaseId: string) {
    return this.tireInventoryService.totalQuantity(purchaseId);
  }

  @ApiOkResponse({
    type: TireInventory,
    description: 'get the total quantity of tires for a  given itemfile id',
  })
  @Get('/quantity-itemfile/:id')
  totalQuantityItemFile(@Param('id') itemFileId: string) {
    return this.tireInventoryService.totalQuantityItemFile(itemFileId);
  }
  @ApiOkResponse({
    type: TireInventory,
    description: 'get all the purchase bill  for a tire inventory',
  })
  @Get('/purchase-bill/:id')
  async getPurchaseBill(@Param('id') id: string) {
    return this.tireInventoryService.getPurchaseBill(id);
  }
  @ApiOkResponse({
    type: TireInventory,
    description: 'get the vendor from which a given tire was bought',
  })
  @Get('/vendor/:id')
  getVendor(@Param('id') itemFileId: string) {
    return this.tireInventoryService.getVendor(itemFileId);
  }
}
