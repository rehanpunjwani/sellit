import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorRepository } from './vendor.repository';

@Injectable()
export class VendorService {
  constructor(private readonly vendorRepository: VendorRepository) { }

  create(createVendorDto: CreateVendorDto) {
    return this.vendorRepository.create(createVendorDto);
  }

  findAll() {
    return this.vendorRepository.findAll();
  }

  findOne(id: string) {
    return this.vendorRepository.findOne(id);
  }

  update(id: string, updateVendorDto: UpdateVendorDto) {
    return this.vendorRepository.update(id, updateVendorDto);
  }

  remove(id: string) {
    return this.vendorRepository.remove(id);
  }

  removeAll() {
    return this.vendorRepository.removeAll();
  }
  getPurchaseBills(id: string) {
    return this.vendorRepository.getAllPurchaseBills(id);
  }
}
