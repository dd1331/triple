import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../repository/user.repository';
import { USER_REPOSITORY } from '../user.constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
  ) {}
  async create(dto: CreateUserDto) {
    const exist = await this.userRepo.existsBy({
      identififer: dto.identififer,
    });

    if (exist) throw new ConflictException('이미 존재하는 아이디입니다');

    const user = this.userRepo.create();

    await user.signup(dto);

    await this.userRepo.save(user);

    return user;
  }
}
