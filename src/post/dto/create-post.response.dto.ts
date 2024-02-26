import { GoodBaseEntity } from '../../common/good-base.entity';

export class CreatePostResponseDto extends GoodBaseEntity<CreatePostResponseDto> {
  postId: number;
}
