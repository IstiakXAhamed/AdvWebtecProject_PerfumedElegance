import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Inject the Reflector (the scanner tool that reads @Roles metadata tags)
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // A. Read the @Roles tags from the route handler
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // B. If the route has NO @Roles tag, it means the route is public! Let them in!
    if (!requiredRoles) {
      return true;
    }

    // C. Get the request object and extract the user (attached by JwtAuthGuard!)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // D. Safety check: If there is no user (forgot to add JwtAuthGuard), block them!
    if (!user) {
      throw new ForbiddenException('Access denied. No user credentials found.');
    }

    // E. Check if the user's role matches any of the required roles
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('Access denied. You do not have the required permissions.');
    }

    return true; // Let them in!
  }
}
