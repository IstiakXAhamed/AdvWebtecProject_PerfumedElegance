import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor( @InjectRepository(User) private readonly  UsersRepository : Repository<User>) {}


    //save a new user to database  !

    async create(createUserDto: CreateUserDto): Promise<User> {
        const cleanEmail = createUserDto.email.trim().toLowerCase();
        const existingUser= await this.findByEmail(cleanEmail);
        if(existingUser){
            throw new BadRequestException('User already exists');
        }

        const newUser = this.UsersRepository.create({
            ...createUserDto,
            email: cleanEmail,
        });
        return this.UsersRepository.save(newUser);
    }
    
    //find a user by email!
    async findByEmail(email:string ): Promise<User | null>{
        return this.UsersRepository.findOneBy({ email: email.trim().toLowerCase() });
    }
    
    //find by id!
    async findById(id: string): Promise<User | null> {
        return this.UsersRepository.findOneBy({ id });
    }

    //update password directly using email
    async updatePassword(email: string, passwordHash: string): Promise<void> {
        await this.UsersRepository.update({ email }, { password: passwordHash });
    }
}

