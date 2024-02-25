import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FILE_SERVICE } from '../file/file-constants';
import { LocalFileService } from '../file/local-file.service';
import { PostController } from './controller/post.controller';
import { Post } from './entities/post.entity';
import { POST_REPOSITORY } from './post.constants';
import { TypePostRespository } from './repository/type-post.repository';
import { PostService } from './service/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [
    PostService,
    { provide: POST_REPOSITORY, useClass: TypePostRespository },
    { provide: FILE_SERVICE, useClass: LocalFileService },
  ],
})
export class PostModule {}
