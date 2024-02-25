import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { FILE_SERVICE } from '../file/file-constants';
import { FileService } from '../file/file.service';
import { PostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { POST_REPOSITORY } from './post.constants';
import { PostRepository } from './repository/post.repositoyr';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
    @Inject(FILE_SERVICE)
    private readonly fileService: FileService,
  ) {}
  async create(posterId: number, dto: PostDto, file: Express.Multer.File) {
    const url = await this.fileService.upload(file);

    const post = this.postRepo.create({
      ...dto,
      posterId,
      img: url,
    });

    await this.postRepo.save(post);

    return post;
  }

  findAll() {
    return `This action returns all post`;
  }

  async findOne(postId: number) {
    const post = await this.postRepo
      .createQueryBuilder('post')
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

    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다');

    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
