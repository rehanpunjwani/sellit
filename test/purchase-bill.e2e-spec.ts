import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Vendor } from "@prisma/client";
import { AppModule } from "src/app.module";
import { ItemFileService } from "src/inventory/item-file/item-file.service";
import { CreatePurchaseBillDto } from "src/inventory/purchase-bill/dto/create-purchase-bill.dto";
import { UpdatePurchaseBillDto } from "src/inventory/purchase-bill/dto/update-purchase-bill.dto";
import { PurchaseBill } from "src/inventory/purchase-bill/entities/purchase-bill.entity";
import { PurchaseBillService } from "src/inventory/purchase-bill/purchase-bill.service";
import { TireInventoryService } from "src/inventory/tire-inventory/tire-inventory.service";
import { VendorService } from "src/inventory/vendor/vendor.service";
import request from 'supertest';
import { createPurchaseBillMock } from "__mocks__/purchase-bill.mock";
import { createTireInventoryMock } from "__mocks__/tire-inventory.mock";
import { createTireItemFileMock } from "__mocks__/tire-item-file.mock";
import { createVendorMock } from "__mocks__/vendor.mock";

describe('Purchase Bill (e2e)', () => {
  let app: INestApplication;
  let purchaseBillService: PurchaseBillService;
  let vendorService: VendorService;
  let tireItemFileService: ItemFileService;
  let tireInventoryService: TireInventoryService;


  // TODO: see if route can come from Reflection
  let basePath = '/purchase-bill';
  let defaultPurchaseBill: PurchaseBill;
  let defaultPurchaseBillClone;
  let defaultVendor: Vendor;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    vendorService = app.get(VendorService);
    purchaseBillService = app.get(PurchaseBillService);
    tireInventoryService = app.get(TireInventoryService);
    tireItemFileService = app.get(ItemFileService);

  });

  beforeEach(async () => {
    await vendorService.removeAll();
    defaultVendor = await vendorService.create(createVendorMock);
    createPurchaseBillMock.vendor_id = defaultVendor.id
    defaultPurchaseBill = await purchaseBillService.create(createPurchaseBillMock);
    defaultPurchaseBillClone = {
      ...defaultPurchaseBill,
      createdAt: defaultPurchaseBill.createdAt.toISOString(),
      updatedAt: defaultPurchaseBill.updatedAt.toISOString(),
    };
  });

  afterEach(async () => {
    await tireInventoryService.removeAll();
    await purchaseBillService.removeAll();
    await vendorService.removeAll()
    await tireItemFileService.removeAll();
  });

  afterAll(async () => {

    await app.close();
  });

  it('should return the all purchase bills (GET)', () => {
    return request(app.getHttpServer())
      .get(basePath)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(
          expect.arrayContaining([defaultPurchaseBillClone])
        );
      });
  });

  it('should return the total cost of purchase bills in a given month (GET)', () => {
    const month = 0
    return request(app.getHttpServer())
      .get(`${basePath}/total-cost?month=${month}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('totalCost')
        expect(body).toEqual({
          totalCost: defaultPurchaseBill.totalCost,
        })
      });
  });

  it('should return the total tires of purchase bills in a given month (GET)', () => {
    const month = 0
    return request(app.getHttpServer())
      .get(`${basePath}/total-tires?month=${month}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('tireQuantity')
        expect(body).toEqual({
          tireQuantity: defaultPurchaseBill.tireQuantity,
        })
      });
  });

  it('should return the purchase bills not paid (GET)', async () => {
    const unPaidBills = await purchaseBillService.getNotPaid();

    return request(app.getHttpServer())
      .get(`${basePath}/payments`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(unPaidBills);
      });
  });

  it('should return the all nearest purchase payments (GET)', async () => {
    const nearestBills = await purchaseBillService.getNearestPayments();

    return request(app.getHttpServer())
      .get(`${basePath}/payments`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(nearestBills);
      });
  });


  it('should return purchase bill with provided id (GET)', () => {
    return request(app.getHttpServer())
      .get(`${basePath}/${defaultPurchaseBill.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(defaultPurchaseBillClone);
      });
  });


  it('should return the all remaining tires by given purchase id  (GET)', async () => {
    const tireItem = await tireItemFileService.create(createTireItemFileMock);
    createTireInventoryMock.itemFileId = tireItem.id;
    createTireInventoryMock.purchaseId = defaultPurchaseBill.id;
    await tireInventoryService.create(createTireInventoryMock);

    const rem = await purchaseBillService.getRemainingTires(defaultPurchaseBill.id);

    return request(app.getHttpServer())
      .get(`${basePath}/remaining/${defaultPurchaseBill.id}`)
      .expect(200)
      .expect((remaining) => {
        expect(remaining.text).toBe(rem.toLocaleString());
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

  it('should return tire inventory for  with provided purchase bill id (GET)', async () => {
    const tireItem = await tireItemFileService.create(createTireItemFileMock);
    createTireInventoryMock.itemFileId = tireItem.id;
    createTireInventoryMock.purchaseId = defaultPurchaseBill.id;
    const tireInventory = await tireInventoryService.create(createTireInventoryMock);
    const tireInventoryClone = {
      ...tireInventory,
      dateOfManufacture: tireInventory.dateOfManufacture.toISOString(),
      createdAt: tireInventory.createdAt.toISOString(),
      updatedAt: tireInventory.updatedAt.toISOString(),
    }
    return request(app.getHttpServer())
      .get(`${basePath}/tire-inventory/${defaultPurchaseBill.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(
          expect.arrayContaining([tireInventoryClone])
        );
      });
  });



  it('should create purchase bill with provided data (POST)', async () => {
    const purchaseBillTwo: CreatePurchaseBillDto = {
      ...createPurchaseBillMock,
      totalCost: 200000,
      tireQuantity: 3000,
      costPaid: 200000,
    };
    const { body: purchaseTwoResponse } = await request(app.getHttpServer())
      .post(`${basePath}/`)
      .send(purchaseBillTwo)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(purchaseBillTwo));
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
      });

    const dbPurchaseTwo = await purchaseBillService.findOne(purchaseTwoResponse.id);
    return expect(dbPurchaseTwo).toEqual(expect.objectContaining(purchaseBillTwo));
  });

  it('should update purchase bill against an id with provided data (PATCH)', async () => {
    const purchaseTwo: UpdatePurchaseBillDto = {
      costPaid: 25000
    };
    await request(app.getHttpServer())
      .patch(`${basePath}/${defaultPurchaseBill.id}`)
      .send(purchaseTwo)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(purchaseTwo));
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
        expect(new Date(body.updatedAt) > defaultPurchaseBill.updatedAt).toBe(true);
      });

    const dbDefaultPurchase = await purchaseBillService.findOne(defaultPurchaseBill.id);

    return expect(dbDefaultPurchase).toEqual(expect.objectContaining(purchaseTwo));
  });

  it('should delete purchase bill against an id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`${basePath}/${defaultPurchaseBill.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(defaultPurchaseBillClone);
      });

    return expect(purchaseBillService.findOne(defaultPurchaseBill.id)).rejects.toThrow(
      'No PurchaseBill found'
    );
  });

  it('should return 200 when deleting purchaseBill that does not exist (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`${basePath}/abc`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({});
      });
  });

});
