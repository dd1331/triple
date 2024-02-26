import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ReqUser } from '../../user/user.decorator';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreatePostResponseDto } from '../dto/create-post.response.dto';
import { DeletePostResponseDto } from '../dto/delete-post.response.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { UpdatePostResponseDto } from '../dto/update-post.response.dto';
import { PostService } from '../service/post.service';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '게시글 작성' })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @ReqUser() { userId },
    @Body() { post }: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const res = await this.postService.create(userId, post, file);

    return new CreatePostResponseDto(res);
  }

  @ApiOperation({ summary: '게시글 조회' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  async update(
    @ReqUser() { userId: posterId },
    @Param('id', ParseIntPipe) id: number,
    @Body() { post }: UpdatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    post.postId = id;
    const res = await this.postService.update(posterId, post, file);

    return new UpdatePostResponseDto(res);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @ReqUser() { userId: posterId },
    @Param('id', ParseIntPipe) postId: number,
  ) {
    const res = await this.postService.remove({ posterId, postId });

    return new DeletePostResponseDto(res);
  }
}
