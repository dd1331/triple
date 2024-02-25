import { fakerKO } from '@faker-js/faker';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as request from 'supertest';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/service/user.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostModule } from './post.module';
describe('Post e2e', () => {
  let app: INestApplication;
  let userService: UserService;
  let authService: AuthService;

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
});
