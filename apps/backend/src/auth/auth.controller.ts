import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
  Get,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;

    if (!email || !password) {
	  throw new BadRequestException('Email and password are required');
  }

    const user = await this.authService.validateUser(email, password);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const token = await this.authService.generateJwt(user);

    return {
	  message: 'Login successful',
	  token,
	  user: {
	    id: user.id,
	    email: user.email,
	    role: user.role,
	  },
    };
  }


  @Post('register')
  async register(@Body() body: any) {
    const { email, password, role } = body;
    const user = await this.authService.register(email, password, role);
    return { message: 'User registered', user };
  }

  // 🔐 JWT-protected route (any authenticated user)
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: any) {
    return {
      message: 'Authenticated route',
      user: req.user,
    };
  }

  // 🛡️ Role-protected route (only "management" role)
  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('management')
  adminOnly(@Request() req: any) {
    return {
      message: 'Welcome, manager',
      user: req.user,
    };
  }
}
