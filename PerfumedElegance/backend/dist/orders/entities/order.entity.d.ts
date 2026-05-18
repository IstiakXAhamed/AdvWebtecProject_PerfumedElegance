import { User } from '../../users/entities/user.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    SHIPPED = "shipped",
    DELIVERED = "delivered"
}
export declare class Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    status: OrderStatus;
    items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    user: User | null;
    createdAt: Date;
}
