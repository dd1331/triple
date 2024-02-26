import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entities/user.entity';
import { UserRepository } from '../../user/repository/user.repository';
import { USER_REPOSITORY } from '../../user/user.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(identififer: string, password: string) {
    const user = await this.userRepo.findOneBy({ identififer });

    if (!user) return null;

    // TODO: refactor
    return user.login({ password });
  }
  login(user: User) {
    const payload = { userId: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
