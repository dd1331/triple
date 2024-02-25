import { Inject, Injectable } from '@nestjs/common';

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

    const post = await this.postRepo.save({
      ...dto,
      posterId,
      img: url,
    });

    return post;
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
