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
        const existingUser= await this.findByEmail(createUserDto.email);
        if(existingUser){
            throw new BadRequestException('User already exists');
        }


        const newUser = this.UsersRepository.create(createUserDto);
        return this.UsersRepository.save(newUser);
    }
    
    //find a user by email!
    async findByEmail(email:string ): Promise<User | null>{
        return this.UsersRepository.findOneBy({ email });
    }
    
    //find by id!
    async findById(id: string): Promise<User | null> {
        return this.UsersRepository.findOneBy({ id });
    }
}

