import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTireInventoryDto } from './dto/create-tire-inventory.dto';
import { UpdateTireInventoryDto } from './dto/update-tire-inventory.dto';

@Injectable()
export class TireInventoryRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(createTireInventoryDto: CreateTireInventoryDto) {
    return this.prisma.tireInventory
      .create({
        data: createTireInventoryDto,
      });
  }

  findAll() {
    return this.prisma.tireInventory.findMany();
  }

  findOne(id: string) {
    return this.prisma.tireInventory
      .findUnique({
        where: { id },
        rejectOnNotFound: true,
      })
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }

  update(id: string, updateTireInventoryDto: UpdateTireInventoryDto) {
    return this.prisma.tireInventory
      .update({
        where: {
          id,
        },
        data: {
          ...updateTireInventoryDto,
        },
      })
      .catch((e) => {
        throw new BadRequestException(e.message);
      });
  }

  remove(id: string) {
    return this.prisma.tireInventory
      .delete({
        where: {
          id,
        },
      })
      .catch((_) => {
      });
  }

  removeAll() {
    return this.prisma.tireInventory.deleteMany();
  }
  countQuantity(purchaseId: string) {
    return this.prisma.tireInventory.aggregate({
      where: {
        purchaseId,
      },
      _sum: {
        quantity: true,

      },
    });
  }
  countQuantityItemFile(itemFileId: string) {
    return this.prisma.tireInventory.aggregate({
      where: {
        itemFileId,
      },
      sum: {
        quantity: true,
      },
    });
  }

  async getPurchaseBill(id: string) {
    return (await this.prisma.tireInventory.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: true,
      select: {
        purchaseBill: true,
      },
    })).purchaseBill;
  }

  async getVendor(id: string) {
    return (await this.prisma.tireInventory.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: true,
      select: {
        purchaseBill: {
          select: {
            vendor: true
          }
        }
      }
    })).purchaseBill.vendor;
  }
  async getTotalTires() {
    return (await this.prisma.tireInventory.aggregate({
      _sum: {
        quantity: true,
      },
    }))._sum;

  }
}
