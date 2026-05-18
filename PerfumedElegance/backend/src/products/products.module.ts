import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { BrandsModule } from 'src/brands/brands.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    //register the product entity in repository
    TypeOrmModule.forFeature([Product]),
    BrandsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
   // Export ProductsService (so other modules, like Cart or Orders, can query products later!)
  exports:[ProductsService]
})
export class ProductsModule {}
