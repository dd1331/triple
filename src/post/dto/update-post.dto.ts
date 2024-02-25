import { PartialType } from '@nestjs/swagger';
import { CreatePostDto, PostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  post: PostDto & { postId: number };
}
