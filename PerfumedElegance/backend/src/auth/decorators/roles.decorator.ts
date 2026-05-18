import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/entities/user.entity'; // Import our Role enum

// 1. The key name we will use to store role data in NestJS metadata
export const ROLES_KEY = 'roles';

// 2. Create the custom @Roles(...) decorator
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
