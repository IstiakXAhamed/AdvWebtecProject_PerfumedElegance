import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
// 1. Tell Passport we are using the JWT strategy
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // A. Extract the JWT from the "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // B. Ensure the token is not expired
      ignoreExpiration: false,
      // C. Use our secret key from .env to verify the token signature
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // 2. This method runs AUTOMATICALLY after the token signature is verified!
  async validate(payload: any) {
    // A. The payload contains the fields we signed during login (sub, email, role)
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found or account deactivated');
    }

    // B. Whatever we return here is automatically attached to the request object as "req.user"
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
