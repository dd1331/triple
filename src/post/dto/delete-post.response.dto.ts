import { GoodBaseEntity } from '../../common/good-base.entity';

export class DeletePostResponseDto extends GoodBaseEntity<DeletePostResponseDto> {
  postId: number;
}
