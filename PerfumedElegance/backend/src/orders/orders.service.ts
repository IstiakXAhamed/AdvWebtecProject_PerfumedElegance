import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  // Create an order, optionally linking a registered user
  async create(createOrderDto: CreateOrderDto, userId?: string): Promise<Order> {
    const newOrder = this.ordersRepository.create({
      ...createOrderDto,
      // If a userId is provided, we format it as an object so TypeORM can link the foreign key.
      // If not, it safely remains null.
      user: userId ? { id: userId } : null,
    });

    return this.ordersRepository.save(newOrder);
  }

  // Get all orders (Admin access)
  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      order: { createdAt: 'DESC' }, // Sort by newest first
    });
  }

  // Get a specific order by ID
  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  // Update order details (like changing status from pending to shipped)
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    const updatedOrder = this.ordersRepository.merge(order, updateOrderDto);
    return this.ordersRepository.save(updatedOrder);
  }

  // Delete an order
  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.ordersRepository.delete(id);
    return { message: 'Order deleted successfully' };
  }
}
