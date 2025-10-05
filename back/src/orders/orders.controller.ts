import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/roles';

@Controller('orders')
@ApiBearerAuth('access-token')
@Roles(Role.Admin, Role.User)
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id;
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrder(id);
  }
}
