import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// 1. Extend the built-in Passport JWT AuthGuard
export class JwtAuthGuard extends AuthGuard('jwt') {}
