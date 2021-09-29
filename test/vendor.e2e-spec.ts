import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VendorType } from '@prisma/client';
import { PurchaseBillService } from 'src/inventory/purchase-bill/purchase-bill.service';
import { CreateVendorDto } from 'src/inventory/vendor/dto/create-vendor.dto';
import { UpdateVendorDto } from 'src/inventory/vendor/dto/update-vendor.dto';
import { Vendor } from 'src/inventory/vendor/entities/vendor.entity';
import { VendorService } from 'src/inventory/vendor/vendor.service';
import request from 'supertest';
import { createPurchaseBillMock } from '__mocks__/purchase-bill.mock';
import { createVendorMock } from '__mocks__/vendor.mock';
import { AppModule } from '../src/app.module';

describe('Vendor (e2e)', () => {
  let app: INestApplication;
  let vendorService: VendorService;
  let purchaseBillService: PurchaseBillService;
  // TODO: see if route can come from Reflection
  let basePath = '/vendor';
  let defaultVendor: Vendor;
  let defaultVendorClone;

  beforeAll(async () => {
    const NODE_ENV = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : '';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    vendorService = app.get(VendorService);
    purchaseBillService = app.get(PurchaseBillService);

  });

  beforeEach(async () => {
    defaultVendor = await vendorService.create(createVendorMock);
    defaultVendorClone = {
      ...defaultVendor,
      createdAt: defaultVendor.createdAt.toISOString(),
      updatedAt: defaultVendor.updatedAt.toISOString(),
    };
  });

  afterEach(async () => {
    await purchaseBillService.removeAll();
    await vendorService.removeAll();

  });

  afterAll(async () => {
    await app.close();
  });

  it('should return all vendors (GET)', () => {
    return request(app.getHttpServer())
      .get(basePath)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(
          expect.arrayContaining([defaultVendorClone])
        );
      });
  });

  it('should return vendor with provided id (GET)', () => {
    return request(app.getHttpServer())
      .get(`${basePath}/${defaultVendor.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(defaultVendorClone);
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

  it('should create vendor with provided data (POST)', async () => {
    const vendorTwo: CreateVendorDto = {
      ...createVendorMock,
      name: 'Vendor Two',
    };
    const { body: vendorTwoResponse } = await request(app.getHttpServer())
      .post(`${basePath}/`)
      .send(vendorTwo)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(vendorTwo));
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
      });

    const dbVendorTwo = await vendorService.findOne(vendorTwoResponse.id);
    return expect(dbVendorTwo).toEqual(expect.objectContaining(vendorTwo));
  });

  it('should update vendor against an id with provided data (PATCH)', async () => {
    const vendorTwo: UpdateVendorDto = {
      name: 'Vendor Two',
      description: 'Some description Again',
      type: VendorType.IMPORT,
    };
    await request(app.getHttpServer())
      .patch(`${basePath}/${defaultVendor.id}`)
      .send(vendorTwo)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(vendorTwo));
        expect(body).toHaveProperty('createdAt');
        expect(body).toHaveProperty('updatedAt');
        expect(new Date(body.updatedAt) > defaultVendor.updatedAt).toBe(true);
      });

    const dbDefaultVendor = await vendorService.findOne(defaultVendor.id);

    return expect(dbDefaultVendor).toEqual(expect.objectContaining(vendorTwo));
  });

  it('should delete vendor against an id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`${basePath}/${defaultVendor.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(defaultVendorClone);
      });

    return expect(vendorService.findOne(defaultVendor.id)).rejects.toThrow(
      'No Vendor found'
    );
  });

  it('should return 200 when deleting vendor that does not exist (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`${basePath}/abc`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({});
      });
  });
  it('should return purchase bill of a vendor with provided id (GET)', async () => {
    createPurchaseBillMock.vendor_id = defaultVendor.id;
    const purchaseBill = await purchaseBillService.create(createPurchaseBillMock);
    const purchaseBillClone = {
      ...purchaseBill,
      createdAt: purchaseBill.createdAt.toISOString(),
      updatedAt: purchaseBill.updatedAt.toISOString()
    }
    return request(app.getHttpServer())
      .get(`${basePath}/purchase-bills/${defaultVendor.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(
          expect.arrayContaining([purchaseBillClone])
        );
      });
  });

});