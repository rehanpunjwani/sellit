import { Injectable } from '@nestjs/common';
import { CreateItemFileDto } from './dto/create-item-file.dto';
import { UpdateItemFileDto } from './dto/update-item-file.dto';
import { ItemFileRepository } from './item-file.repository';

@Injectable()
export class ItemFileService {
  constructor(private readonly itemFileRepository: ItemFileRepository) { }

  create(createItemFileDto: CreateItemFileDto) {
    return this.itemFileRepository.create(createItemFileDto);
  }

  findAll() {
    return this.itemFileRepository.findAll();
  }

  findOne(id: string) {
    return this.itemFileRepository.findOne(id);
  }

  update(id: string, updateItemFileDto: UpdateItemFileDto) {
    return this.itemFileRepository.update(id, updateItemFileDto);
  }

  remove(id: string) {
    return this.itemFileRepository.remove(id);
  }

  removeAll() {
    return this.itemFileRepository.removeAll();
  }
  getTireInventory(id: string) {
    return this.itemFileRepository.getTireInventory(id);
  }
}
