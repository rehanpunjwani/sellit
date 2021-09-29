import { Injectable } from '@nestjs/common';
import { CreateTireInventoryDto } from './dto/create-tire-inventory.dto';
import { UpdateTireInventoryDto } from './dto/update-tire-inventory.dto';
import { TireInventoryRepository } from './tire-inventory.repository';

@Injectable()
export class TireInventoryService {
  constructor(
    private readonly tireInventoryRepository: TireInventoryRepository,
  ) { }
  create(createTireInventoryDto: CreateTireInventoryDto) {
    return this.tireInventoryRepository.create(createTireInventoryDto);
  }

  findAll() {
    return this.tireInventoryRepository.findAll();
  }

  findOne(id: string) {
    return this.tireInventoryRepository.findOne(id);
  }

  update(id: string, updateTireInventoryDto: UpdateTireInventoryDto) {
    return this.tireInventoryRepository.update(id, updateTireInventoryDto);
  }

  remove(id: string) {
    return this.tireInventoryRepository.remove(id);
  }
  removeAll() {
    return this.tireInventoryRepository.removeAll();
  }
  totalQuantity(purchaseId: string) {
    return this.tireInventoryRepository.countQuantity(purchaseId);
  }
  totalQuantityItemFile(itemFileId: string) {
    return this.tireInventoryRepository.countQuantityItemFile(itemFileId);
  }
  getPurchaseBill(id: string) {
    return this.tireInventoryRepository.getPurchaseBill(id);
  }
  getVendor(id: string) {
    return this.tireInventoryRepository.getVendor(id);
  }

  getTotalTires() {
    return this.tireInventoryRepository.getTotalTires();
  }


}
