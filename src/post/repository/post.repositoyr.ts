import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

export interface PostRepository extends Repository<Post> {}
