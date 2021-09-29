import { TireBrand, TireMade, TirePattern, TireSize } from "@prisma/client";

export const tireItemData = [
  { brand: TireBrand.BRIDGESTONE, size: TireSize.ONEEIGHTFIVE_EIGHTYFIVE, pattern: TirePattern.CAMBER, made: TireMade.PAKISTAN, },
  { brand: TireBrand.DUNLOP, size: TireSize.ONESEVENFIVE_SEVENTY, pattern: TirePattern.CUP, made: TireMade.INDONESIA, },
  { brand: TireBrand.MICHELIN, size: TireSize.ONEEIGHTFIVE_EIGHTYFIVE, pattern: TirePattern.CUP, made: TireMade.JAPAN, },
]

 /* await prisma.vendor.createMany({
    data: [
      { name: "Vendor 1", description: "this is vendor 1", type: VendorType.LOCAL },
      { name: "Vendor 2", description: "this is vendor 2", type: VendorType.IMPORT },
      { name: "Vendor 2", description: "this is vendor 2", type: VendorType.LOCAL },
    ],
    skipDuplicates: true,
  });
  await prisma.tireItemFile.createMany({
    data: [
      { brand: TireBrand.BRIDGESTONE, size: TireSize.ONEEIGHTFIVE_EIGHTYFIVE, pattern: TirePattern.CAMBER, made: TireMade.PAKISTAN, },
      { brand: TireBrand.DUNLOP, size: TireSize.ONESEVENFIVE_SEVENTY, pattern: TirePattern.CUP, made: TireMade.INDONESIA, },
      { brand: TireBrand.MICHELIN, size: TireSize.ONEEIGHTFIVE_EIGHTYFIVE, pattern: TirePattern.CUP, made: TireMade.JAPAN, },
    ],
    skipDuplicates: true,
  });

  await prisma.purchaseBill.create({
    data: 
      {
        totalCost: 300000,
        advancePaid: 100000,
        tireQuantity: 2000,
        costPaid: 100000,
        vendor: {
          create: vendorData[0]
        },
        nextPaymentDate: new Date('2021-11-02'),
        nextPaymentAmount: 100000
      },
        
  });
  await prisma.purchaseBill.create({
    data: 
      {
        totalCost: 200000,
        tireQuantity: 3000,
        costPaid: 200000,
        vendor: {
          create: vendorData[1]
        },
      },
        
  });
  await prisma.purchaseBill.create({
    data: 
    {
      totalCost: 40000,
      advancePaid: 4000,
      tireQuantity: 200,
      costPaid: 20000,
      vendor: {
        create: vendorData[2]
      },
      nextPaymentDate: new Date('2022-03-22'),
      nextPaymentAmount: 20000
    },
        
  }); */