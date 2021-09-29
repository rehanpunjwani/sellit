import { Module } from '@nestjs/common';
import { ItemFileController } from './item-file/item-file.controller';
import { ItemFileRepository } from './item-file/item-file.repository';
import { ItemFileService } from './item-file/item-file.service';
import { PurchaseBillController } from './purchase-bill/purchase-bill.controller';
import { PurchaseBillRepository } from './purchase-bill/purchase-bill.repository';
import { PurchaseBillService } from './purchase-bill/purchase-bill.service';
import { TireInventoryController } from './tire-inventory/tire-inventory.controller';
import { TireInventoryRepository } from './tire-inventory/tire-inventory.repository';
import { TireInventoryService } from './tire-inventory/tire-inventory.service';
import { VendorController } from './vendor/vendor.controller';
import { VendorRepository } from './vendor/vendor.repository';
import { VendorService } from './vendor/vendor.service';

@Module({
  controllers: [
    ItemFileController,
    PurchaseBillController,
    TireInventoryController,
    VendorController,
  ],
  providers: [
    ItemFileService,
    ItemFileRepository,
    PurchaseBillService,
    PurchaseBillRepository,
    TireInventoryService,
    TireInventoryRepository,
    VendorService,
    VendorRepository,
  ],
})
export class InventoryModule {}
