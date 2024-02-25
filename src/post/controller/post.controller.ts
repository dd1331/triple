import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ReqUser } from '../../user/user.decorator';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostService } from '../service/post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  create(
    @ReqUser() { userId },
    @Body() { post }: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postService.create(userId, post, file);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  update(
    @ReqUser() { userId: posterId },
    @Param('id', ParseIntPipe) id: number,
    @Body() { post }: UpdatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    post.postId = id;

    return this.postService.update(posterId, post, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @ReqUser() { userId: posterId },
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postService.remove({ posterId, postId });
  }
}
