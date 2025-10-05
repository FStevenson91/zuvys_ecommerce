import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { FileUploadRepository } from './file-upload.repository';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    private readonly fileUploadRepository: FileUploadRepository,
  ) {}
  async uploadImage(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const uploadResponse = await this.fileUploadRepository.uploadImage(file);

    await this.productsRepository.update(product.id, {
      imgUrl: uploadResponse.url,
    });

    return await this.productsRepository.findOneBy({ id: productId });
  }
}

// no existe un repositorio virtual de cloudinary, por eso se crea el file-upload.repository.ts, para manejar la logica de cloudinary, y en el servicio se inyecta ese repositorio para usarlo en el servicio de file-upload.
