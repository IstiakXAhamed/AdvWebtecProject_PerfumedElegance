import { IsNotEmpty, IsString, IsEmail, IsArray, ValidateNested, ArrayMinSize, IsNumber, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

// Define what a single item inside the order's "items" array should look like
class OrderItemDto {
  @IsUUID('4', { message: 'Product ID must be a valid UUID' })
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer name is required' })
  customerName: string;

  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty()
      
  customerEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Customer phone is required' })
  customerPhone: string;

  @IsString()
  @IsNotEmpty({ message: 'Shipping address is required' })
  shippingAddress: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
