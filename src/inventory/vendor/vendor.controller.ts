import {
  Body,
  Controller,
  Delete,
  Get, Param,
  Patch,
  Post
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';
import { VendorService } from './vendor.service';

@ApiTags('Vendor')
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }

  @ApiOkResponse({
    type: Vendor,
    description: 'create a vendor',
  })
  @Post()
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @ApiOkResponse({
    isArray: true,
    type: Vendor,
    description: 'get all tire vendors',
  })
  @Get()
  findAll() {
    return this.vendorService.findAll();
  }

  @ApiOkResponse({
    type: Vendor,
    description: 'get vendor by given id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorService.findOne(id);
  }

  @ApiOkResponse({
    type: Vendor,
    description: 'updated vendor with given id',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @ApiOkResponse({
    type: Vendor,
    description: 'delete vendor with given id',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorService.remove(id);
  }
  @ApiOkResponse({
    type: Vendor,
    description: 'get purchase bill by given vendor id',
  })
  @Get('/purchase-bills/:id')
  getPurchaseBills(@Param('id') id: string) {
    return this.vendorService.getPurchaseBills(id);
  }
}
