import { Brand } from "../../brands/entities/brand.entity";
export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    brand: Brand;
}
