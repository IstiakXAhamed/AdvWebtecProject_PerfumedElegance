declare class OrderItemDto {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    items: OrderItemDto[];
}
export {};
