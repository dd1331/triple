import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Strategy } from 'passport-local';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'identififer' });
  }

  async validate(identififer: string, password: string): Promise<any> {
    const dto = plainToClass(LoginDto, { identififer, password });

    const res = await validate(dto);

    if (res.length) throw new BadRequestException('입력한 정보를 확인해주세요');

    const user = await this.authService.validateUser(identififer, password);

    if (!user) throw new UnauthorizedException('로그인 실패');
    return user;
  }
}
