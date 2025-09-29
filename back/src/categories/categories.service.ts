import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { Repository } from 'typeorm';
import * as data from '../../src/products/data/products.json';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}
  async addCategories() {
    const categoriesNames = new Set(data.map((element) => element.category));
    const categoriesArray = Array.from(categoriesNames);
    const categories = categoriesArray.map((category) => ({ name: category }));

    await this.categoriesRepository.upsert(categories, ['name']);

    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
