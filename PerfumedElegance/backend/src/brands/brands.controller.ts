import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import JWT Lock
import { RolesGuard } from '../auth/guards/roles.guard'; // Import Roles Checker
import { Roles } from '../auth/decorators/roles.decorator'; // Import @Roles tag
import { Role } from '../users/entities/user.entity'; // Import Role enum

@Controller('brands') // All routes in this controller start with "/brands"
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  // CREATE A BRAND (Admin Only!)
  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Lock the route with JWT and Roles guards
  @Roles(Role.ADMIN) // Tag this route as ADMIN only!
 
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  
  // GET ALL BRANDS (Public!)
  
  @Get()
  async findAll() {
    return this.brandsService.findALl();
  }

  
  // GET A SPECIFIC BRAND BY ID (Public!)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  
  //  UPDATE A BRAND BY ID (Admin Only!)
  
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  
  //  DELETE A BRAND BY ID (Admin Only!)

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.ADMIN)
    
  async remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
