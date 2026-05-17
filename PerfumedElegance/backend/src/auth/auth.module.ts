import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // 1. Import UsersModule so we can use UsersService
    UsersModule,

    // 2. Import PassportModule (the core security engine NestJS uses)
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 3. Configure the JWT engine asynchronously using values from our .env file
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<any>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  // Export PassportModule and JwtModule so we can use them in other modules later
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
