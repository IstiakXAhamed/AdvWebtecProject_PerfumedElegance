import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
export declare class BrandsService {
    private readonly brandsRepository;
    constructor(brandsRepository: Repository<Brand>);
    create(createBrandDto: CreateBrandDto): Promise<Brand>;
    findALl(): Promise<Brand[]>;
    findOne(id: string): Promise<Brand>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
