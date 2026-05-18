import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, Min, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price must be a positive value' })
  price: number;

  @IsInt({ message: 'Stock must be an integer (whole number)' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsUUID('4', { message: 'Invalid Brand ID format (must be a valid UUID)' })
  @IsNotEmpty({ message: 'Brand ID is required to link the product' })
  brandId: string;
}
