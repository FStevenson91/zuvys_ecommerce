import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';
import { Products } from './entities/product.entity';
import * as data from '../../src/products/data/products.json';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async create(): Promise<string> {
    const categories: Categories[] = await this.categoriesRepository.find();

    if (categories.length === 0) {
      throw new NotFoundException(
        'No se encontraron categorías. Porfavor "seed" categorias primero.',
      );
    }
    const products: Products[] = [];

    for (const element of data) {
      const category: Categories | undefined = categories.find(
        (category) => element.category === category.name,
      );
      if (!category) {
        throw new BadRequestException(
          `Categoria '${element.category}' no encontrada para producto '${element.name}'`,
        );
      }

      const existingProduct = await this.productsRepository.findOneBy({
        name: element.name,
      });

      const newProduct = new Products();
      newProduct.name = element.name;
      newProduct.description = element.description;
      newProduct.price = element.price;
      newProduct.imgUrl = element?.imgUrl;
      newProduct.stock = element.stock;
      newProduct.category = category!;
      newProduct.imgUrl =
        existingProduct?.imgUrl || element.imgUrl || 'No image';
      newProduct.category = category;

      if (existingProduct) {
        newProduct.id = existingProduct.id;
      }
      products.push(newProduct);
    }

    try {
      await this.productsRepository.save(products);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al guardar o actualizar productos en la database',
      );
    }
    return 'Products Added';
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
