import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
@Injectable()
export class TestRepository {
  constructor(private readonly prisma: PrismaService) { }

  countTireQuantityPurchaseBill(id: string) {
    return this.prisma.tireInventory.aggregate({
      where: {
        purchaseId: id,
      },
      _sum: {
        quantity: true,
      },
    });

  }
  countTireQuantityItemFile(itemFileId: string) {
    return this.prisma.tireInventory.aggregate({
      where: {
        itemFileId,
      },
      sum: {
        quantity: true,
      },
    });
  }

  getTireInventoryfromItemFile(id: string) {
    return this.prisma.tireItemFile.findUnique({
      where: {
        id
      },
      select: {
        tires: true,
      },
    });
  }

  getPurchaseBillfromTireInventory(id: string) {
    return this.prisma.tireInventory.findUnique({
      where: {
        id,
      },
      select: {
        purchaseBill: true,
      },
    });

  }
  getTireInventoryfromPurchaseBill(id: string) {
    return this.prisma.purchaseBill.findUnique({
      where: {
        id,
      },
      select: {
        tireInventoryItems: true,
      },
    });

  }
  getAllPaidPurchaseBills() {
    return this.prisma.$queryRaw(
      `SELECT * FROM PurchaseBill  where totalCost != costPaid`
    );
  }
  getAllPurchaseBillsByVendor(id: string) {
    return this.prisma.vendor.findUnique({
      where: {
        id,
      },
      select: {
        purchaseBills: true,
      },
    });

  }

  getVendorForTireInventory(id: string) {
    return this.prisma.tireInventory.findUnique({
      where: {
        id,
      },
      select: {
        purchaseBill: {
          select: {
            vendor: true
          }
        }
      }
    })
  }
  async getRemainingTiresForPurchaseBill(id: string) {
    const purchaseBillQuantity = await this.prisma.purchaseBill.findUnique({
      where: {
        id,
      },
      select: {
        tireQuantity: true
      }
    });
    const inventoryQuantity = await this.prisma.tireInventory.findFirst({
      where: {
        purchaseId: id,
      },
      select: {
        quantity: true,
      }

    });

    return purchaseBillQuantity.tireQuantity - inventoryQuantity.quantity;

  }
  getTotalTiresInventory() {
    return this.prisma.tireInventory.aggregate({
      _sum: {
        quantity: true,
      },
    });

  }

  getTiresBoughtMonth() {
    let date = new Date();
    return this.prisma.purchaseBill.aggregate({
      _sum: {
        tireQuantity: true,
      },
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), 1),
          lte: date
        },
      },
    });
  }
  getTiressBoutghtSixMonths() {
    let date = new Date();
    return this.prisma.purchaseBill.aggregate({
      _sum: {
        tireQuantity: true,
      },
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth() - 6, date.getDate()),
          lte: date
        },
      },
    });
  }
  getTiressBoutghtLastYear() {
    let date = new Date();
    return this.prisma.purchaseBill.aggregate({
      _sum: {
        tireQuantity: true,
      },
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), 0, 1),
          lte: new Date()
        },
      },
    });
  }
  getTiresOfAllTime() {
    return this.prisma.purchaseBill.aggregate({
      _sum: {
        tireQuantity: true,
      },
    });

  }
  getTotalPurchaseBillMonth() {
    let date = new Date();
    return this.prisma.purchaseBill.aggregate({
      _sum: {
        totalCost: true,
      },
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), 1),
          lte: new Date(date.getFullYear(), date.getMonth() + 1, 0)
        },
      },
    });
  }
  getTotalPurchaseBillSixMonths() {
    let date = new Date();
    return this.prisma.purchaseBill.aggregate({
      _sum: {
        totalCost: true,
      },
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth() - 6, date.getDate()),
          lte: new Date()
        },
      },
    });
  }
  getTotalPurchaseBillLastYear() {
    let date = new Date();
    return this.prisma.purchaseBill.aggregate({
      _sum: {
        totalCost: true,
      },
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), 0, 1),
          lte: new Date()
        },
      },
    });
  }
  getTotalPurchaseBillOfAllTime() {
    return this.prisma.purchaseBill.aggregate({
      _sum: {
        totalCost: true,
      },
    });

  }
  getThreeNearestPayments() {
    return this.prisma.purchaseBill.findMany({
      take: 3,
      orderBy: [
        {
          nextPaymentDate: 'asc'
        }
      ],
      where: {
        nextPaymentDate: {
          gte: new Date(),
        },
      },

    });

  }
}

 // const quantityInput = createTireInventoryDto.quantity;
    // const tireQuantity = (await this.tireInventoryRepository.countQuantity(createTireInventoryDto.purchaseId))._sum.quantity;
    // const totalQuantity = (await this.purchaseBillRepository.findOne(createTireInventoryDto.purchaseId)).tireQuantity;
    // if (quantityInput > (totalQuantity - tireQuantity)) {
    //   throw new BadRequestException("the quantity cannot exceed the total tires in purchase bill")
    // }