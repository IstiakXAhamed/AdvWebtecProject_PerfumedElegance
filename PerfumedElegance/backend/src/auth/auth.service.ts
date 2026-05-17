import { Injectable,UnauthorizedException,ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersModule } from 'src/users/users.module';
import passport from 'passport';
import { log } from 'console';




@Injectable()
export class AuthService {
    constructor(
        //injecting usersservice so we can check save users in database 

        private readonly usersService: UsersService,

        //iinjecting JwtService to generate tokens 
        private readonly jwtService:JwtService,
    ) { }
    
    //Register method 
    async register(createUserDto: CreateUserDto) {
        //check if already user exist 
        const existingUser = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('Email is already registered !!');

        }
        
        //secure pass with bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

        //save the user with hashed pass 
        const savedUser = await this.usersService.create({
            ...createUserDto, password: hashedPassword,//overwrite pass with hashed pass 
        });

        //return a success text
        return {
            message: 'User registered successfully',
            userId: savedUser.id,
        };

    }

    async login(loginDto: LoginDto) {
        //search for user 
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            //if user id not found 
            throw new UnauthorizedException('Invalid email or password ');
        }

        //compare the incoming plain pass with the encrypted hashed pass !
        const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password)
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid email or Password')
        }

        //create the jwt payload 
        const payload = {
            sub: user.id, //default standard name for token owner is sub or subject , we will need it in authguard setup 
            email: user.email,
            role: user.role,

        };

        //sign the payload using secrete key to generate the token
        const token = this.jwtService.sign(payload);

        //return the secure login ticket 
        return {
            access_token: token,
        };


     }

}
