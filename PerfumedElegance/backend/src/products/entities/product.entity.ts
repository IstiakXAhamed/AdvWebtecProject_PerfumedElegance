import { Brand } from "src/brands/entities/brand.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column()
    name: string
    
    @Column({ nullable: true })
    description: string

     //  Store price as a decimal number (e.g., 99.99)
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;
    
    @Column({ nullable: true })
    imageUrl: string
    
    @ManyToOne(() => Brand, {
        onDelete: 'SET NULL',
        eager:true,
    })
    brand : Brand
}
