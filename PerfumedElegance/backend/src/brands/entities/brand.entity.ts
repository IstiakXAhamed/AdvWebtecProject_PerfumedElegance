
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('brands')
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ unique: true })
    name: string;
    
    @Column({ nullable: true })
    description: string;
    

}
