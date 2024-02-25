import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostRepository } from './post.repositoyr';

@Injectable()
export class TypePostRespository
  extends Repository<Post>
  implements PostRepository
{
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
