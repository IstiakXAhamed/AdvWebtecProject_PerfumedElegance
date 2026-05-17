import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // 1. Tell NestJS that this module is allowed to use the User entity toolbox (Repository)
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]    // 2. Export it so we can import it in AuthModule
})
export class UsersModule {}
