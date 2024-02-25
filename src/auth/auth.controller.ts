import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // TODO: 타입지정
  create(@Request() { user }: { user: User }) {
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard)
  @Get('guarded')
  findAll() {
    return true;
  }
}
