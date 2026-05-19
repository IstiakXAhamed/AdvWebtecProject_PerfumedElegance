import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../entities/order.entity';
declare const UpdateOrderDto_base: import("@nestjs/common").Type<Partial<CreateOrderDto>>;
export declare class UpdateOrderDto extends UpdateOrderDto_base {
    status?: OrderStatus;
}
export {};
