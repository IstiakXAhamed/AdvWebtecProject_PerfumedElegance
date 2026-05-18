
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('brands')
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ unique: true })
    name: string;
    
    @Column({ nullable: true })
    description: string;
    //prevent circular dependency ,'`'''(a) => Product, we make it "lazy". It tells TypeORM: "Don't try to look up the Product class 
    // instantly at boot. Wait until all files are fully loaded first, then look it up!"
    //relation with product table
    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];

}
