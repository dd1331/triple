import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FILE_SERVICE } from '../file/file-constants';
import { LocalFileService } from '../file/local-file.service';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypePostRespository } from './repository/type-post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [
    PostService,
    TypePostRespository,
    { provide: FILE_SERVICE, useClass: LocalFileService },
  ],
})
export class PostModule {}
