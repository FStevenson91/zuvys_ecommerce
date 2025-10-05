import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/categories/entities/category.entity';
import { MoreThan, Repository } from 'typeorm';
import { Products } from './entities/product.entity';
import * as data from '../../src/products/data/products.json';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async productSeed(): Promise<string> {
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

  async getProductById(id: string): Promise<Products> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async getProducts(page?: number, limit?: number): Promise<Products[]> {
    const products = await this.productsRepository.find({
      where: { stock: MoreThan(0) },
      relations: ['category'],
    });

    if (page !== undefined && limit !== undefined) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return products.slice(startIndex, endIndex);
    }

    return products;
  }

  async createProduct(productDto: CreateProductDto): Promise<Products> {
    const category = await this.categoriesRepository.findOneBy({
      id: productDto.categoryId,
    });
    if (!category) throw new NotFoundException('Categoría no encontrada');

    const newProduct = this.productsRepository.create({
      ...productDto,
      category,
    });

    return this.productsRepository.save(newProduct);
  }
}
