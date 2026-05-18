import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersService {
    private readonly ordersRepository;
    constructor(ordersRepository: Repository<Order>);
    create(createOrderDto: CreateOrderDto, userId?: string): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
