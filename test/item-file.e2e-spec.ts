import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TireBrand, TireMade } from '@prisma/client';
import { CreateItemFileDto } from 'src/inventory/item-file/dto/create-item-file.dto';
import { UpdateItemFileDto } from 'src/inventory/item-file/dto/update-item-file.dto';
import { TireItemFile } from 'src/inventory/item-file/entities/item-file.entity';
import { ItemFileService } from 'src/inventory/item-file/item-file.service';
import { PurchaseBillService } from 'src/inventory/purchase-bill/purchase-bill.service';
import { TireInventoryService } from 'src/inventory/tire-inventory/tire-inventory.service';
import { VendorService } from 'src/inventory/vendor/vendor.service';
import request from 'supertest';
import { createPurchaseBillMock } from '__mocks__/purchase-bill.mock';
import { createTireInventoryMock } from '__mocks__/tire-inventory.mock';
import { createTireItemFileMock } from '__mocks__/tire-item-file.mock';
import { createVendorMock } from '__mocks__/vendor.mock';
import { AppModule } from '../src/app.module';

describe('Tire Item File (e2e)', () => {
  let app: INestApplication;
  let tireItemFileService: ItemFileService;
  let vendorService: VendorService;
  let purchaseBillService: PurchaseBillService;
  let tireInventoryService: TireInventoryService;

  // TODO: see if route can come from Reflection
  let basePath = '/item-file';
  let defaultTireItemFile: TireItemFile;
  let defaultTireItemFileClone;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    tireItemFileService = app.get(ItemFileService);
    purchaseBillService = app.get(PurchaseBillService);
    vendorService = app.get(VendorService);
    tireInventoryService = app.get(TireInventoryService);

  });

  beforeEach(async () => {

    defaultTireItemFile = await tireItemFileService.create(
      createTireItemFileMock
    );
    defaultTireItemFileClone = {
      ...defaultTireItemFile,
      createdAt: defaultTireItemFile.createdAt.toISOString(),
      updatedAt: defaultTireItemFile.updatedAt.toISOString(),
    };
  });

  afterEach(async () => {
    await tireInventoryService.removeAll();
    await purchaseBillService.removeAll();
    await vendorService.removeAll();
    await tireItemFileService.removeAll();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return all item-files (GET)', () => {
    return request(app.getHttpServer())
      .get(basePath)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(
          expect.arrayContaining([defaultTireItemFileClone])
        );
      });
  });


  it('should return item-file with provided id (GET)', () => {
    return request(app.getHttpServer())
      .get(`${basePath}/${defaultTireItemFile.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(defaultTireItemFileClone);
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

  it('should create item-file with provided data (POST)', async () => {
    const tireItemFileTwo: CreateItemFileDto = {
      ...createTireItemFileMock,
      brand: TireBrand.DUNLOP,
      made: TireMade.INDONESIA,
    };
    const { body: tireItemFileTwoResponse } = await request(app.getHttpServer())
      .post(`${basePath}/`)
      .send(tireItemFileTwo)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(tireItemFileTwo));
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
      });

    const dbTireItemFileTwo = await tireItemFileService.findOne(
      tireItemFileTwoResponse.id
    );
    return expect(dbTireItemFileTwo).toEqual(
      expect.objectContaining(tireItemFileTwo)
    );
  });


  it('should return 409 when duplicate item-file data is provided (POST)', async () => {
    return request(app.getHttpServer())
      .post(`${basePath}/`)
      .send(defaultTireItemFile)
      .expect(409)
      .expect(({ body }) => {
        expect(body).toHaveProperty('error');
        expect(body).toHaveProperty('message');
      });
  });

  it('should update item-file against an id with provided data (PATCH)', async () => {
    const tireItemFileTwo: UpdateItemFileDto = {
      brand: TireBrand.YOKOHAMA,
      made: TireMade.PAKISTAN,
    };
    await request(app.getHttpServer())
      .patch(`${basePath}/${defaultTireItemFile.id}`)
      .send(tireItemFileTwo)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(tireItemFileTwo));
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
        expect(new Date(body.updatedAt) > defaultTireItemFile.updatedAt).toBe(
          true
        );
      });

    const dbDefaultTireItemFile = await tireItemFileService.findOne(
      defaultTireItemFile.id
    );

    return expect(dbDefaultTireItemFile).toEqual(
      expect.objectContaining(tireItemFileTwo)
    );
  });

  it('should delete item-file against an id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`${basePath}/${defaultTireItemFile.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(defaultTireItemFileClone);
      });

    return expect(
      tireItemFileService.findOne(defaultTireItemFile.id)
    ).rejects.toThrow('No TireItemFile found');
  });

  it('should return 200 when deleting item-file that does not exist (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`${basePath}/abc`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({});
      });
  });

  it('should return all the tire inventory from item-file id', async () => {

    const vendor = await vendorService.create(createVendorMock);
    createPurchaseBillMock.vendor_id = vendor.id
    const purchaseBill = await purchaseBillService.create(createPurchaseBillMock);
    createTireInventoryMock.itemFileId = defaultTireItemFile.id
    createTireInventoryMock.purchaseId = purchaseBill.id;
    const tireInventory = await tireInventoryService.create(createTireInventoryMock);
    const tireInventoryClone = {
      ...tireInventory,
      dateOfManufacture: tireInventory.dateOfManufacture.toISOString(),
      createdAt: tireInventory.createdAt.toISOString(),
      updatedAt: tireInventory.updatedAt.toISOString()
    }
    return request(app.getHttpServer())
      .get(`${basePath}/tire-inventory/${defaultTireItemFile.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(
          expect.arrayContaining([tireInventoryClone])
        );
      });
  });
});