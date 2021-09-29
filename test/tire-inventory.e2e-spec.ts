import { TireBrand, TireMade, TirePattern, TireSize } from ".prisma/client";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { CreateItemFileDto } from "src/inventory/item-file/dto/create-item-file.dto";
import { TireItemFile } from "src/inventory/item-file/entities/item-file.entity";
import { ItemFileService } from "src/inventory/item-file/item-file.service";
import { PurchaseBill } from "src/inventory/purchase-bill/entities/purchase-bill.entity";
import { PurchaseBillService } from "src/inventory/purchase-bill/purchase-bill.service";
import { CreateTireInventoryDto } from "src/inventory/tire-inventory/dto/create-tire-inventory.dto";
import { UpdateTireInventoryDto } from "src/inventory/tire-inventory/dto/update-tire-inventory.dto";
import { TireInventory } from "src/inventory/tire-inventory/entities/tire-inventory.entity";
import { TireInventoryService } from "src/inventory/tire-inventory/tire-inventory.service";
import { Vendor } from "src/inventory/vendor/entities/vendor.entity";
import { VendorService } from "src/inventory/vendor/vendor.service";
import request from 'supertest';
import { createPurchaseBillMock } from "__mocks__/purchase-bill.mock";
import { createTireInventoryMock } from "__mocks__/tire-inventory.mock";
import { createTireItemFileMock } from "__mocks__/tire-item-file.mock";
import { createVendorMock } from "__mocks__/vendor.mock";

describe('Tire Inventory (e2e)', () => {
  let app: INestApplication;
  let tireInventoryService: TireInventoryService;
  let vendorService: VendorService;
  let tireItemFileService: ItemFileService;
  let purchaseBillService: PurchaseBillService;

  // TODO: see if route can come from Reflection
  let basePath = '/tire-inventory';
  let defaultTireInventory: TireInventory;
  let defaultTireInventoryClone;
  let defaultVendor: Vendor;
  let defaultItemFile: TireItemFile
  let defaultPurchaseBill: PurchaseBill;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    vendorService = app.get(VendorService);
    tireInventoryService = app.get(TireInventoryService);
    purchaseBillService = app.get(PurchaseBillService);
    tireItemFileService = app.get(ItemFileService);
  });

  beforeEach(async () => {
    // const newItemFile = {
    //   ...createTireItemFileMock,
    //   brand: TireBrand.DUNLOP, size: TireSize.ONESEVENFIVE_SEVENTY, pattern: TirePattern.CUP, made: TireMade.INDONESIA,
    // }
    await tireInventoryService.removeAll();
    await purchaseBillService.removeAll();
    await vendorService.removeAll();
    await tireItemFileService.removeAll();

    defaultVendor = await vendorService.create(createVendorMock);
    defaultItemFile = await tireItemFileService.create(createTireItemFileMock);
    createPurchaseBillMock.vendor_id = defaultVendor.id
    defaultPurchaseBill = await purchaseBillService.create(createPurchaseBillMock);
    createTireInventoryMock.itemFileId = defaultItemFile.id;
    createTireInventoryMock.purchaseId = defaultPurchaseBill.id;
    defaultTireInventory = await tireInventoryService.create(createTireInventoryMock);
    defaultTireInventoryClone = {
      ...defaultTireInventory,
      dateOfManufacture: defaultTireInventory.dateOfManufacture.toISOString(),
      createdAt: defaultTireInventory.createdAt.toISOString(),
      updatedAt: defaultTireInventory.updatedAt.toISOString(),
    };

  });

  afterEach(async () => {
    await tireInventoryService.removeAll();
    await purchaseBillService.remove(defaultPurchaseBill.id);
    await vendorService.removeAll();
    await tireItemFileService.removeAll();

  });

  afterAll(async () => {
    await app.close();
  });


  it('should return all tire Invenotry (GET)', () => {
    return request(app.getHttpServer())
      .get(basePath)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(
          expect.arrayContaining([defaultTireInventoryClone])
        );
      });
  });


  it('should return total number of tire Invenotry (GET)', async () => {
    const tireItemFile: CreateItemFileDto = {
      brand: TireBrand.MICHELIN, size: TireSize.ONEEIGHTFIVE_EIGHTYFIVE, pattern: TirePattern.CUP, made: TireMade.JAPAN,
    }
    const itemFileTwo = await tireItemFileService.create(tireItemFile);
    const TireInventoryTwo: CreateTireInventoryDto = {
      ...createTireInventoryMock,
      quantity: 20,
      averageSellingPrice: 15,
      dateOfManufacture: new Date('2020-12-21'),
      purchasePrice: 10,
      sellingPrice: 20,
      itemFileId: itemFileTwo.id
    };

    const tireTwo = await tireInventoryService.create(TireInventoryTwo);

    return request(app.getHttpServer())
      .get(`${basePath}/total`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          quantity: (defaultTireInventory.quantity + tireTwo.quantity)
        });
      });
  });

  it('should return total quantity of tire Invenotry for given purchase id(GET)', async () => {
    const tireItemFile: CreateItemFileDto = {
      brand: TireBrand.MICHELIN, size: TireSize.ONEEIGHTFIVE_EIGHTYFIVE, pattern: TirePattern.CUP, made: TireMade.JAPAN,
    }
    const itemFileTwo = await tireItemFileService.create(tireItemFile);
    const TireInventoryTwo: CreateTireInventoryDto = {
      ...createTireInventoryMock,
      quantity: 20,
      averageSellingPrice: 15,
      dateOfManufacture: new Date('2020-12-21'),
      purchasePrice: 10,
      sellingPrice: 20,
      itemFileId: itemFileTwo.id
    };

    const tireTwo = await tireInventoryService.create(TireInventoryTwo);
    return request(app.getHttpServer())
      .get(`${basePath}/quantity-purchase/${defaultPurchaseBill.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          _sum: {
            quantity: defaultTireInventory.quantity + tireTwo.quantity
          }
        });
      });
  });

  it('should return total quantity of tire Invenotry for given item-file id(GET)', async () => {
    const TireInventoryTwo: CreateTireInventoryDto = {
      ...createTireInventoryMock,
      quantity: 20,
      averageSellingPrice: 15,
      dateOfManufacture: new Date('2020-12-21'),
      purchasePrice: 10,
      sellingPrice: 20,
    };

    const tireTwo = await tireInventoryService.create(TireInventoryTwo);


    return request(app.getHttpServer())
      .get(`${basePath}/quantity-itemfile/${defaultItemFile.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          sum: {
            quantity: defaultTireInventory.quantity + tireTwo.quantity,
          }
        });
      });
  });

  it('should return tire Inventory with provided id (GET)', () => {
    return request(app.getHttpServer())
      .get(`${basePath}/${defaultTireInventory.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(defaultTireInventoryClone);
      });
  });

  it('should return 404 if provided id is incorrect (GET)', () => {
    return request(app.getHttpServer())
      .get(`${basePath}/abc`)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('error');
      });
  });

  it('should create tire inventory with provided data (POST)', async () => {
    const tireItemFile: CreateItemFileDto = {
      brand: TireBrand.MICHELIN, size: TireSize.ONEEIGHTFIVE_EIGHTYFIVE, pattern: TirePattern.CUP, made: TireMade.JAPAN,
    }
    const itemFileTwo = await tireItemFileService.create(tireItemFile);
    const TireInventoryTwo: CreateTireInventoryDto = {
      ...createTireInventoryMock,
      quantity: 20,
      averageSellingPrice: 15,
      dateOfManufacture: new Date('2020-12-21'),
      purchasePrice: 10,
      sellingPrice: 20,
      itemFileId: itemFileTwo.id
    };
    const TireInventoryTwoClone = {
      ...TireInventoryTwo,
      dateOfManufacture: TireInventoryTwo.dateOfManufacture.toISOString(),
    }
    const { body: purchaseTwoResponse } = await request(app.getHttpServer())
      .post(`${basePath}/`)
      .send(TireInventoryTwo)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(TireInventoryTwoClone));
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
      });

    const dbPurchaseTwo = await tireInventoryService.findOne(purchaseTwoResponse.id);
    return expect(dbPurchaseTwo).toEqual(expect.objectContaining(TireInventoryTwo));
  });

  it('should update tire inventory against an id with provided data (PATCH)', async () => {
    const purchaseTwo: UpdateTireInventoryDto = {
      purchasePrice: 25000,
    };
    await request(app.getHttpServer())
      .patch(`${basePath}/${defaultTireInventory.id}`)
      .send(purchaseTwo)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(purchaseTwo));
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
        expect(new Date(body.updatedAt) > defaultTireInventory.updatedAt).toBe(true);
      });

    const dbDefaultPurchase = await tireInventoryService.findOne(defaultTireInventory.id);

    return expect(dbDefaultPurchase).toEqual(expect.objectContaining(purchaseTwo));
  });

  it('should return all purchaseBill for given id (GET)', () => {
    const purchaBillClone = {
      ...defaultPurchaseBill,
      createdAt: defaultPurchaseBill.createdAt.toISOString(),
      updatedAt: defaultPurchaseBill.updatedAt.toISOString()
    }
    return request(app.getHttpServer())
      .get(`${basePath}/purchase-bill/${defaultTireInventory.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(
          purchaBillClone
        );
      });
  });


  it('should delete purchase bill against an id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`${basePath}/${defaultTireInventory.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(defaultTireInventoryClone);
      });

    return expect(tireInventoryService.findOne(defaultTireInventory.id)).rejects.toThrow(
      'No TireInventory found'
    );
  });

  it('should return 200 when deleting TireInventory that does not exist (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`${basePath}/abc`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({});
      });
  });

});
