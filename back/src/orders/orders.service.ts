import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Products } from 'src/products/entities/product.entity';
import { Users } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,

    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,

    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { products } = createOrderDto;
    const user: Users | null = await this.usersRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const order = new Orders();
    order.user = user;
    order.date = new Date();

    const newOrder = await this.ordersRepository.save(order);

    let total = 0;

    const productsArray: Products[] = await Promise.all(
      products.map(async (element) => {
        const product: Products | null =
          await this.productsRepository.findOneBy({
            id: element,
          });

        if (!product) {
          throw new NotFoundException('Producto no encontrado');
        }
        if (product.stock <= 0) {
          throw new BadRequestException(
            `Producto ${product.name} fuera de stock `,
          );
        }

        total += Number(product.price); //debemos convertir el valor decimal a number para que pueda sumar, ya que por defecto viene como string y eso haria que la suma sea una concatenacion de strings, y lo que queremos es una suma de numeros

        await this.productsRepository.update(
          { id: product.id },
          { stock: product.stock - 1 },
        );

        return product;
      }),
    );

    const orderDetail = new OrderDetails();
    orderDetail.order = newOrder;
    orderDetail.price = Number(total.toFixed(2)); // aca volvemos a convertir el total a number, para que no haya problemas con la base de datos al guardar el total.
    orderDetail.products = productsArray;

    await this.orderDetailsRepository.save(orderDetail);

    return await this.ordersRepository.find({
      where: { id: newOrder.id },
      relations: { orderDetails: true },
    });
  }

  async getUserOrderById(userId: string, orderId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });
    if (!order) {
      throw new NotFoundException('Orden no encontrada para este usuario');
    }
    return order;
  }

  async getUserOrders(userId: string) {
    return await this.ordersRepository.find({
      where: { user: { id: userId } },
    });
  }

  async getOrder(id: string) {
    const order: Orders | null = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }
}
