import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create a new order (Public access for guests and customers)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    // We pass the DTO to the service. For simplicity in this public route, 
    // the user ID remains null, and we rely on the customerEmail for identification.
    return this.ordersService.create(createOrderDto);
  }

  // View all orders (Admin only)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return this.ordersService.findAll();
  }

  // View details of a specific order (Admin only)
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  // Update order status (Admin only)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  // Delete an order (Admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
