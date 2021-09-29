import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemFileDto } from './dto/create-item-file.dto';
import { UpdateItemFileDto } from './dto/update-item-file.dto';

@Injectable()
export class ItemFileRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(createItemFileDto: CreateItemFileDto) {
    return this.prisma.tireItemFile
      .create({ data: createItemFileDto })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new ConflictException('TireItemFile already exists');
          }
        }

        throw e;
      });
  }

  findAll() {
    return this.prisma.tireItemFile.findMany();
  }

  findOne(id: string) {
    return this.prisma.tireItemFile
      .findUnique({ where: { id }, rejectOnNotFound: true })
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }

  update(id: string, updateItemFileDto: UpdateItemFileDto) {
    return this.prisma.tireItemFile.update({
      where: {
        id,
      },
      data: {
        ...updateItemFileDto,
      },
    }).catch((e) => {
      throw new BadRequestException(e.message);
    });;
  }

  remove(id: string) {
    return this.prisma.tireItemFile
      .delete({
        where: {
          id,
        },
      })
      .catch((_) => { });
  }

  removeAll() {
    return this.prisma.tireItemFile.deleteMany();
  }
  async getTireInventory(id: string) {
    return (await this.prisma.tireItemFile.findUnique({
      where: {
        id
      },
      rejectOnNotFound: true,
      select: {
        tires: true,
      },
    }).catch((e) => {
      throw new NotFoundException(e.message);
    })).tires;
  }
}
