import {Entity, PrimaryGeneratedColumn,Column, PrimaryColumn } from "typeorm";

export enum Role {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
}

@Entity('users') //table name users set !
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    fullName: string;
    
    @Column({unique: true})  // Unique email text column 
    email: string;

    @Column()
    password: string

    @Column({type : 'enum',enum : Role, default: Role.CUSTOMER})
    role: Role
}