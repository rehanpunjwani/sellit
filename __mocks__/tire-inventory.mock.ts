import { CreateTireInventoryDto } from "src/inventory/tire-inventory/dto/create-tire-inventory.dto";

export const createTireInventoryMock: CreateTireInventoryDto = {
  itemFileId: '',
  dateOfManufacture: new Date('2018-12-21'),
  quantity: 100,
  sellingPrice: 80,
  averageSellingPrice: 90,
  purchasePrice: 30,
  purchaseId: '',
}