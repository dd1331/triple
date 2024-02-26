import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../post/entities/post.entity';
import { UserController } from './controller/user.controller';
import { User } from './entities/user.entity';
import { TypeUserRespository } from './repository/type-user.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, TypeUserRespository],
  exports: [TypeUserRespository, TypeOrmModule.forFeature([User, Post])],
})
export class UserModule {}
