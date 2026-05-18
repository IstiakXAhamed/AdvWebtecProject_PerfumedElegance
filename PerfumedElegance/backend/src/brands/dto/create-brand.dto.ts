import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
    @IsNotEmpty({message:'Brand name is required !'})
    @IsString()
    name: string;
    
    @IsString()
    @IsOptional()
    description?: string;

}
