import { Controller, Post, Body, UseGuards, Get, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth') // All routes in this controller will start with "/auth"
export class AuthController {
  constructor(
    // 1. Inject the AuthService so we can call register() and login()
    private readonly authService: AuthService,
  ) {}

  // 2. Handle POST requests to "/auth/register"
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Passes the validated form data to our service's register method
    return this.authService.register(createUserDto);
  }

  // 3. Handle POST requests to "/auth/login"
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Passes the validated email/password to our service's login method
    return this.authService.login(loginDto);
  }

  //testing purpose so that we can verify
  @Get('me')
  @UseGuards(JwtAuthGuard) // put lock on the route me
  async getProfile(@Req() req: any) {
    //@Req() req: Extracts the Node/Express request object
    //since guard unlocked the door , user info attached to re.user
    return req.user;
  }

  // 4. Retrieve security question assigned to specific email
  @Get('forgot-password/question/:email')
  async getSecurityQuestion(@Param('email') email: string) {
    return this.authService.getSecurityQuestion(email);
  }

  // 5. Verify security answer and reset password
  @Post('forgot-password/reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
