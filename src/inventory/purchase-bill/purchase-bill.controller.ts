import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatePurchaseBillDto } from './dto/create-purchase-bill.dto';
import { UpdatePurchaseBillDto } from './dto/update-purchase-bill.dto';
import { PurchaseBill } from './entities/purchase-bill.entity';
import { PurchaseBillService } from './purchase-bill.service';

@ApiTags('Purchase Bill')
@Controller('purchase-bill')
export class PurchaseBillController {
  constructor(private readonly purchaseBillService: PurchaseBillService) { }

  @ApiOkResponse({
    type: PurchaseBill,
    description: 'create a purchase bill',
  })
  @Post()
  create(@Body() createPurchaseBillDto: CreatePurchaseBillDto) {
    return this.purchaseBillService.create(createPurchaseBillDto);
  }

  @ApiOkResponse({
    type: PurchaseBill,
    description: 'get all the purchase bills',
  })
  @Get()
  findAll() {
    return this.purchaseBillService.findAll();
  }

  @ApiOkResponse({
    type: PurchaseBill,
    description: 'get three nearest purchase bill payments',
  })
  @Get('/payments')
  getNearestPayments() {
    return this.purchaseBillService.getNearestPayments();
  }

  @ApiOkResponse({
    type: PurchaseBill,
    description: 'get the total tires till given month (0: all time , 1: 1 month back, 6: six months back)',
  })
  @Get('/total-cost')
  getTotalPurchaseCost(@Query('month') month: number) {
    return this.purchaseBillService.getTotalCost(month);
  }

  @ApiOkResponse({
    type: PurchaseBill,
    description: 'get the total purchase cost till given month (0: all time , 1: 1 month back, 6: six months back)',
  })
  @Get('/total-tires')
  getTotalTiresBought(@Query('month') month: number) {
    return this.purchaseBillService.getTotalTires(month);
  }

  @ApiOkResponse({
    type: PurchaseBill,
    description: 'get all the not paid purchase bills',
  })
  @Get('/not-paid')
  getAllPaid() {
    return this.purchaseBillService.getNotPaid();
  }

  @ApiOkResponse({
    type: PurchaseBill,
    description: 'get Purchase bill by given id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseBillService.findOne(id);
  }
  @ApiOkResponse({
    type: PurchaseBill,
    description: 'update Purchase bill by given id',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseBillDto: UpdatePurchaseBillDto) {
    return this.purchaseBillService.update(id, updatePurchaseBillDto);
  }

  @ApiOkResponse({
    type: PurchaseBill,
    description: 'delete Purchase bill by given id',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseBillService.remove(id);
  }

  @ApiOkResponse({
    type: PurchaseBill,
    description: 'get Tire Inventory for a given purchase bill id',
  })
  @Get('/tire-inventory/:id')
  getTireInventory(@Param('id') id: string) {
    return this.purchaseBillService.getTireInventory(id);
  }
  @ApiOkResponse({
    type: PurchaseBill,
    description: 'get remaining tires given purchase bill id',
  })
  @Get('/remaining/:id')
  getRemainingTires(@Param('id') id: string) {
    return this.purchaseBillService.getRemainingTires(id);
  }



}
