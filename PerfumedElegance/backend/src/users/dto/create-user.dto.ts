import { IsEmail,IsNotEmpty, IsString,MinLength} from "class-validator";

export class CreateUserDto {

    @IsString({message: 'Full name must be a string'})
    @IsNotEmpty({message: 'Full name is required'})
    fullName: string

    @IsEmail()
    @IsNotEmpty({message: 'Email is required !'})
    email: string

    @IsNotEmpty({message: 'Password is required !'})
    @MinLength(6,{message : 'Password must be at least 6 characters long !'}) 
    password: string
}