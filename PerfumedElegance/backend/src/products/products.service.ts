import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BrandsService } from '../brands/brands.service'; 

@Injectable()
export class ProductsService {
  constructor(
    //  Inject our Product repository toolbox
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    //  Inject our Brands service so we can verify brand IDs exist!
    private readonly brandsService: BrandsService,
  ) {}

  // CREATE A PRODUCT

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // A. Verify that the Brand exists first! (Will throw NotFoundException if missing)
    const brand = await this.brandsService.findOne(createProductDto.brandId);

    // B. Create the product and link the brand object
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      brand, // TypeORM binds the brand's foreign key automatically!
    });

    // C. Save and return the saved product
    return this.productsRepository.save(newProduct);
  }

  // GET ALL PRODUCTS
  async findAll(): Promise<Product[]> {
    // Returns all products. Because "eager: true" was set on the Product entity,
    // this will automatically JOIN and return the Brand data with each product!
    return this.productsRepository.find();
  }

  // GET A SPECIFIC PRODUCT BY ID
  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  //  UPDATE A PRODUCT BY ID
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // A. Find the product first to make sure it exists
    const product = await this.findOne(id);

    // B. If they are updating the brand, verify that the new brand exists!
    let brand = product.brand;
    if (updateProductDto.brandId) {
      brand = await this.brandsService.findOne(updateProductDto.brandId);
    }

    // C. Merge the fields and the verified brand object
    const updatedProduct = this.productsRepository.merge(product, {
      ...updateProductDto,
      brand,
    });

    // D. Save to DB
    return this.productsRepository.save(updatedProduct);
  }

  //  DELETE A PRODUCT BY ID
  async remove(id: string): Promise<{ message: string }> {
    // A. Make sure it exists
    await this.findOne(id);

    // B. Delete from DB
    await this.productsRepository.delete(id);

    return { message: 'Product deleted successfully' };
  }
}
