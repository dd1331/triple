import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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
  async findOneByOrFail(
    where: FindOptionsWhere<Post> | FindOptionsWhere<Post>[],
  ): Promise<Post> {
    const post = await this.findOneBy(where);

    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다');

    return post;
  }

  getPostView(postId: number) {
    return this.createQueryBuilder('post')
      .select('post.postId', 'postId')
      .addSelect('post.title', 'title')
      .addSelect('post.content', 'content')
      .addSelect('post.img', 'img')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect('post.updatedAt', 'updatedAt')
      .addSelect('poster.name', 'name')
      .addSelect('post.posterId', 'posterId')
      .innerJoin('post.poster', 'poster')
      .where('post.postId =:postId', { postId })
      .getRawOne();
  }
}
