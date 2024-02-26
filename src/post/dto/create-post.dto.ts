import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 150)
  title: string;

  @IsNotEmpty()
  @Length(5)
  @IsString()
  content: string;
}

export class CreatePostDto {
  @Transform(({ value }) => plainToInstance(PostDto, JSON.parse(value)))
  @Type(() => PostDto)
  @ValidateNested()
  post: PostDto;

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  img?: Express.Multer.File;
}
