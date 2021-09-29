import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePurchaseBillDto } from './dto/create-purchase-bill.dto';
import { UpdatePurchaseBillDto } from './dto/update-purchase-bill.dto';


@Injectable()
export class PurchaseBillRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(createPurchaseBillDto: CreatePurchaseBillDto) {
    return this.prisma.purchaseBill.create({
      data: createPurchaseBillDto
    }
    ).catch((e) => {
      throw new BadRequestException(e.message);
    });
  }

  findAll() {
    return this.prisma.purchaseBill.findMany();
  }

  findOne(id: string) {
    return this.prisma.purchaseBill
      .findUnique({
        where: { id },
        rejectOnNotFound: true,
      })
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }

  update(id: string, updatePurchaseBillDto: UpdatePurchaseBillDto) {
    return this.prisma.purchaseBill.update({
      where: {
        id,
      },
      data: {
        ...updatePurchaseBillDto,
      },
    }).catch((e) => {
      throw new BadRequestException(e.message);
    });
  }

  remove(id: string) {
    return this.prisma.purchaseBill
      .delete({
        where: {
          id,
        },
      })
      .catch((_) => { });
  }

  removeAll() {
    return this.prisma.purchaseBill.deleteMany();
  }
  getNotPaid() {
    return this.prisma.$queryRaw(
      'SELECT * FROM "PurchaseBill" WHERE "totalCost" != "costPaid";'
    );
  }
  async getTireInvetory(id: string) {
    return (await this.prisma.purchaseBill.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: true,
      select: {
        tireInventoryItems: true,
      },
    }).catch((e) => {
      throw new NotFoundException(e.message);
    })).tireInventoryItems;
  }

  async getTotalTires(month: number) {
    let date = new Date();
    if (month == 0) {
      return (await this.prisma.purchaseBill.aggregate({
        _sum: {
          tireQuantity: true,
        },
      }))._sum;
    }
    return (await this.prisma.purchaseBill.aggregate({
      _sum: {
        tireQuantity: true,
      },
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth() - month, date.getDate()),
          lte: date
        },
      },
    }))._sum;


  }
  async getTotalPurchaseCost(month: number) {
    let date = new Date();
    if (month == 0) {
      return (await this.prisma.purchaseBill.aggregate({
        _sum: {
          totalCost: true,
        },
      }))._sum;
    }
    else {
      return (await this.prisma.purchaseBill.aggregate({
        _sum: {
          totalCost: true,
        },
        where: {
          createdAt: {
            gte: new Date(date.getFullYear(), date.getMonth() - month, date.getDate()),
            lte: date
          },
        },
      }))._sum
    };
  }

  getNearestPayments() {
    return this.prisma.$queryRaw('SELECT * FROM blog."PurchaseBill" WHERE "totalCost" > "costPaid" ORDER BY "nextPaymentDate" ASC LIMIT 3;');
  }
}
