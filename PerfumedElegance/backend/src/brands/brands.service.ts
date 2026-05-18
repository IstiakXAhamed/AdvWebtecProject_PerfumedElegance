import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BrandsService {

  constructor(
    //Inject Brand repository we registered in module 
    @InjectRepository(Brand)
    private readonly brandsRepository : Repository<Brand>,
  ) { }
  
  //create Brand
  async create(createBrandDto: CreateBrandDto): Promise<Brand>{
    //check if name exist 
    const existingBrand = await this.brandsRepository.findOneBy({ name: createBrandDto.name });

    if (existingBrand) {
      throw new ConflictException('Brand Name already exist ')
    }

    const newBrand = this.brandsRepository.create(createBrandDto)
    return this.brandsRepository.save(newBrand)
  }

  //get all 

  async findALl(): Promise<Brand[]>{
   return this.brandsRepository.find()
 }


  // 4. GET A SPECIFIC BRAND BY ID
  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandsRepository.findOneBy({ id });
    if (!brand) {
      throw new NotFoundException(`Brand with ID "${id}" not found`);
    }
    return brand;
  }

  //Update Brand 
  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    //FInd brand make sure exist 
    const brand = await this.findOne(id)

    //if changing name , check if name is already taken 
    if (updateBrandDto.name && updateBrandDto.name !== brand.name) {
      const existingBrand = await this.brandsRepository.findOneBy({name:updateBrandDto.name})
      if (existingBrand) {
      throw new ConflictException("Brand name is already taken")
    }
    
    }

    const updatedBrand = this.brandsRepository.merge(brand,updateBrandDto)
    return this.brandsRepository.save(updatedBrand)
  
  }
   // 6. DELETE A BRAND
  async remove(id: string): Promise<{ message: string }> {
    // First, make sure the brand exists
    await this.findOne(id);
    // Delete it from PostgreSQL
    await this.brandsRepository.delete(id);
    return { message: 'Brand deleted successfully' };
  }
  
  
}
