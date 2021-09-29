import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(createVendorDto: CreateVendorDto) {
    return this.prisma.vendor.create({ data: createVendorDto });
  }

  findAll() {
    return this.prisma.vendor.findMany();
  }

  findOne(id: string) {
    return this.prisma.vendor
      .findUnique({
        where: { id },
        rejectOnNotFound: true,
      })
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }

  update(id: string, updateVendorDto: UpdateVendorDto) {
    return this.prisma.vendor.update({
      where: {
        id,
      },
      data: {
        ...updateVendorDto,
      },
    }).catch((e) => {
      throw new BadRequestException(e.message);
    });
  }

  remove(id: string) {
    return this.prisma.vendor.delete({
      where: {
        id,
      },
    })
      .catch((_) => {
      });
  }

  removeAll() {
    return this.prisma.vendor.deleteMany();
  }
  async getAllPurchaseBills(id: string) {
    return (await this.prisma.vendor.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: true,
      select: {
        purchaseBills: true,
      },
    }).catch((e) => {
      throw new NotFoundException(e.message);
    })).purchaseBills;

  }
}
