import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, plainToInstance } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PostDto } from './create-post.dto';

class UpdatePost extends PostDto {
  @ApiHideProperty()
  postId: number;
}

export class UpdatePostDto {
  @Transform(({ value }) => plainToInstance(PostDto, JSON.parse(value)))
  @ValidateNested()
  post: UpdatePost;

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  img?: Express.Multer.File;
}
