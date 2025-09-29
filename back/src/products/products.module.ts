import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/categories/entities/category.entity';
import { Products } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, Products])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
