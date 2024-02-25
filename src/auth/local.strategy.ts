import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'identififer' });
  }

  async validate(identififer: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(identififer, password);

    if (!user) throw new UnauthorizedException('로그인 실패');
    return user;
  }
}