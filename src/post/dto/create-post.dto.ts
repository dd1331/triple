import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { User } from '../../user/entities/user.entity';

export type PostDto = {
  title: string;
  content: string;
};

export class CreatePostDto extends PartialType(User) {
  @Transform(({ value }) => {
    return JSON.parse(value).post;
  })
  post: PostDto;
}
