import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { FILE_SERVICE } from '../../file/file-constants';
import { FileService } from '../../file/file.service';
import { PostDto } from '../dto/create-post.dto';
import { POST_REPOSITORY } from '../post.constants';
import { PostRepository } from '../repository/post.repositoyr';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: PostRepository,
    @Inject(FILE_SERVICE)
    private readonly fileService: FileService,
  ) {}
  async create(posterId: number, dto: PostDto, file?: Express.Multer.File) {
    const url = file ? await this.fileService.upload(file) : null;

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
    const post = await this.postRepo.getPostView(postId);

    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다');

    return post;
  }

  async update(
    posterId: number,
    { postId, ...rest }: PostDto & { postId: number },
    file?: Express.Multer.File,
  ) {
    const post = await this.postRepo.findOneByOrFail({ postId });

    const isMine = post.posterId !== posterId;
    if (isMine)
      throw new UnauthorizedException('본인의 게시글만 수정가능합니다');

    const url = file ? await this.fileService.upload(file) : post.img || null;
    post.update({ ...rest, img: url });

    await this.postRepo.save(post);

    return post;
  }

  async remove({ postId, posterId }: { posterId: number; postId: number }) {
    const post = await this.postRepo.findOneByOrFail({ postId });
    const isMine = post.posterId !== posterId;
    if (isMine)
      throw new UnauthorizedException('본인의 게시글만 삭제가능합니다');

    return this.postRepo.softRemove(post);
  }
}
