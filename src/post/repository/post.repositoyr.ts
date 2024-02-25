import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostViewResponse } from './PostViewResponse';

export interface PostRepository extends Repository<Post> {
  getPostView(postId: number): Promise<PostViewResponse>;
}
