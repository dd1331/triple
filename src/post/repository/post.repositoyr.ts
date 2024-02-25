import { Repository } from 'typeorm';
import { PostViewResponse } from '../dto/post-view.response';
import { Post } from '../entities/post.entity';

export interface PostRepository extends Repository<Post> {
  getPostView(postId: number): Promise<PostViewResponse>;
}
