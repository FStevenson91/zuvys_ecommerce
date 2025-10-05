import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/products/entities/product.entity';
import { Users } from 'src/users/entities/user.entity';
import { Orders } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Orders, OrderDetails, Products])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
