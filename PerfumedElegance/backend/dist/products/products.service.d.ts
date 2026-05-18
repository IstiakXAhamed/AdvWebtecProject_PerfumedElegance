import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BrandsService } from '../brands/brands.service';
export declare class ProductsService {
    private readonly productsRepository;
    private readonly brandsService;
    constructor(productsRepository: Repository<Product>, brandsService: BrandsService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
