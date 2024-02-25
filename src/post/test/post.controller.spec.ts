import { fakerKO } from '@faker-js/faker';
import {
  HttpStatus,
  INestApplication,
  NotFoundException,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as request from 'supertest';
import { AuthModule } from '../../auth/auth.module';
import { AuthService } from '../../auth/auth.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserService } from '../../user/service/user.service';
import { CreatePostDto, PostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostModule } from '../post.module';
import { PostService } from '../service/post.service';
describe('Post e2e', () => {
  let app: INestApplication;
  let userService: UserService;
  let authService: AuthService;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // TODO: 합치기
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'gombeul_css',
          dropSchema: true,
          autoLoadEntities: true,
          synchronize: true,
        }),
        AuthModule,
        PostModule,
      ],
    }).compile();

    app = module.createNestApplication();
    userService = app.get<UserService>(UserService);
    authService = app.get<AuthService>(AuthService);
    postService = app.get<PostService>(PostService);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init();
  });
  afterEach(async () => await app.close());

  it('제목, 내용, 이미지, 작성자 정보, 작성일 등을 포함한 게시글 작성', async () => {
    const dto: CreateUserDto = {
      identififer: fakerKO.string.alphanumeric(10),
      password: fakerKO.string.alphanumeric(10),
      name: fakerKO.person.fullName(),
    };
    const user = await userService.create(dto);

    const { accessToken } = authService.login(user);

    const postDto: CreatePostDto = {
      post: {
        title: fakerKO.lorem.sentence(),
        content: fakerKO.lorem.paragraphs(),
      },
    };

    const imageFilePath = 'Untitled.png';
    const imageData = fs.readFileSync(imageFilePath);

    return request(app.getHttpServer())
      .post('/posts')
      .set({ Authorization: `Bearer ${accessToken}` })
      .field('post', JSON.stringify(postDto))
      .attach('img', imageData, imageFilePath)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.postId).toEqual(expect.any(Number));
        expect(body.title).toEqual(expect.any(String));
        expect(body.content).toEqual(expect.any(String));
        expect(body.img).toEqual(expect.any(String));
        expect(body.posterId).toEqual(expect.any(Number));
        expect(body.createdAt).toEqual(expect.any(String));
        expect(body.updatedAt).toEqual(expect.any(String));
      });
  });

  it('제목, 내용, 이미지, 작성자 정보, 작성일 등을 포함한 게시글 조회', async () => {
    const dto: CreateUserDto = {
      identififer: fakerKO.string.alphanumeric(10),
      password: fakerKO.string.alphanumeric(10),
      name: fakerKO.person.fullName(),
    };
    const user = await userService.create(dto);

    const { accessToken } = authService.login(user);

    const postDto: CreatePostDto = {
      post: {
        title: fakerKO.lorem.sentence(),
        content: fakerKO.lorem.paragraphs(),
      },
    };

    const imageFilePath = 'Untitled.png';
    const imageData = fs.readFileSync(imageFilePath);

    const { body } = await request(app.getHttpServer())
      .post('/posts')
      .set({ Authorization: `Bearer ${accessToken}` })
      .field('post', JSON.stringify(postDto))
      .attach('img', imageData, imageFilePath);

    return request(app.getHttpServer())
      .get('/posts/' + body.postId)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.postId).toEqual(expect.any(Number));
        expect(body.title).toEqual(expect.any(String));
        expect(body.content).toEqual(expect.any(String));
        expect(body.img).toEqual(expect.any(String));
        expect(body.posterId).toEqual(expect.any(Number));
        expect(body.createdAt).toEqual(expect.any(String));
        expect(body.updatedAt).toEqual(expect.any(String));
      });
  });

  it('없는 게시글 조회시 에러', async () => {
    await expect(postService.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('게시글 삭제 성공', async () => {
    const dto: CreateUserDto = {
      identififer: fakerKO.string.alphanumeric(10),
      password: fakerKO.string.alphanumeric(10),
      name: fakerKO.person.fullName(),
    };
    const user = await userService.create(dto);
    const postDto: PostDto = {
      title: fakerKO.lorem.sentence(),
      content: fakerKO.lorem.paragraphs(),
    };
    const post = await postService.create(user.userId, postDto);
    const res = await postService.remove({ posterId: 1, postId: post.postId });
    expect(res.deleteAt).toEqual(expect.any(Date));
  });

  it('타인게시글 삭제시 에러', async () => {
    const dto: CreateUserDto = {
      identififer: fakerKO.string.alphanumeric(10),
      password: fakerKO.string.alphanumeric(10),
      name: fakerKO.person.fullName(),
    };
    const user = await userService.create(dto);
    const postDto: PostDto = {
      title: fakerKO.lorem.sentence(),
      content: fakerKO.lorem.paragraphs(),
    };
    const post = await postService.create(user.userId, postDto);
    await expect(
      postService.remove({ posterId: 999999, postId: post.postId }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('없는 게시글 삭제시 에러', async () => {
    await expect(
      postService.remove({ posterId: 1, postId: 1 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('없는 게시글 수정시 에러', async () => {
    await expect(
      postService.update(1, { postId: 1, title: 'tes', content: 'dd' }),
    ).rejects.toThrow(NotFoundException);
  });
  it('타인 게시글 수정시 에러', async () => {
    const dto: CreateUserDto = {
      identififer: fakerKO.string.alphanumeric(10),
      password: fakerKO.string.alphanumeric(10),
      name: fakerKO.person.fullName(),
    };
    const user = await userService.create(dto);
    const postDto: PostDto = {
      title: fakerKO.lorem.sentence(),
      content: fakerKO.lorem.paragraphs(),
    };
    const post = await postService.create(user.userId, postDto);
    await expect(
      postService.update(99999, {
        postId: post.postId,
        title: 'tes',
        content: 'dd',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('게시글 수정 성공', async () => {
    const dto: CreateUserDto = {
      identififer: fakerKO.string.alphanumeric(10),
      password: fakerKO.string.alphanumeric(10),
      name: fakerKO.person.fullName(),
    };
    const user = await userService.create(dto);
    const { accessToken } = authService.login(user);
    const postDto: PostDto = {
      title: fakerKO.lorem.sentence(),
      content: fakerKO.lorem.paragraphs(),
    };
    const post = await postService.create(user.userId, postDto);
    const newTitle = 'newTitle';
    const newContent = 'newContent';
    const imageFilePath = 'Untitled.png';
    const imageData = fs.readFileSync(imageFilePath);
    const updatePostDto: UpdatePostDto = {
      post: {
        title: newTitle,
        content: newContent,
      },
    } as UpdatePostDto;

    return request(app.getHttpServer())
      .patch('/posts/' + post.postId)
      .set({ Authorization: `Bearer ${accessToken}` })
      .field('post', JSON.stringify(updatePostDto))
      .attach('img', imageData, imageFilePath)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.postId).toBe(post.postId);
        expect(body.title).toBe(newTitle);
        expect(body.content).toBe(newContent);
        expect(body.img).toEqual(expect.any(String));
        expect(body.posterId).toBe(post.posterId);
        expect(body.createdAt).toEqual(expect.any(String));
        expect(body.updatedAt).toEqual(expect.any(String));
      });
  });
});
