import { Injectable } from '@nestjs/common';
import { TireInventoryRepository } from '../tire-inventory/tire-inventory.repository';
import { CreatePurchaseBillDto } from './dto/create-purchase-bill.dto';
import { UpdatePurchaseBillDto } from './dto/update-purchase-bill.dto';
import { PurchaseBillRepository } from './purchase-bill.repository';

@Injectable()
export class PurchaseBillService {
  constructor(private readonly purchaseBillRepository: PurchaseBillRepository, private readonly tireInventoryRepository: TireInventoryRepository) { }

  create(createPurchaseBillDto: CreatePurchaseBillDto) {
    return this.purchaseBillRepository.create(createPurchaseBillDto);
  }

  findAll() {
    return this.purchaseBillRepository.findAll();
  }

  findOne(id: string) {
    return this.purchaseBillRepository.findOne(id);
  }

  update(id: string, updatePurchaseBillDto: UpdatePurchaseBillDto) {
    return this.purchaseBillRepository.update(id, updatePurchaseBillDto);
  }

  remove(id: string) {
    return this.purchaseBillRepository.remove(id);
  }
  removeAll() {
    return this.purchaseBillRepository.removeAll();
  }
  getNotPaid() {
    return this.purchaseBillRepository.getNotPaid();
  }
  getTireInventory(id: string) {
    return this.purchaseBillRepository.getTireInvetory(id);
  }

  async getRemainingTires(id: string) {
    const tireQuantity = (await this.tireInventoryRepository.countQuantity(id))._sum.quantity;
    const totalQuantity = (await this.purchaseBillRepository.findOne(id)).tireQuantity;

    return (totalQuantity - tireQuantity);
  }

  getTotalTires(month: number) {
    return this.purchaseBillRepository.getTotalTires(month)
  }

  getTotalCost(month: number) {
    return this.purchaseBillRepository.getTotalPurchaseCost(month);
  }
  getNearestPayments() {
    return this.purchaseBillRepository.getNearestPayments();
  }
}
