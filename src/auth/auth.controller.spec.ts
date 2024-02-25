import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as request from 'supertest';
import { UserService } from '../user/service/user.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('Auth e2e', () => {
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
      ],
    }).compile();

    userService = module.get<UserService>(UserService);

    authService = module.get<AuthService>(AuthService);

    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => await app.close());

  it('인가 실패', () => {
    return request(app.getHttpServer())
      .get('/auth/guarded')
      .expect(HttpStatus.UNAUTHORIZED);
  });
  it('인가 성공', async () => {
    const dto: CreateUserDto = {
      identififer: 'test',
      password: '1234',
    };

    const user = await userService.create(dto);

    const { accessToken } = await authService.login(user);

    return request(app.getHttpServer())
      .get('/auth/guarded')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(HttpStatus.OK);
  });
  it('로그인 성공', async () => {
    const dto: CreateUserDto = {
      identififer: 'test',
      password: '1234',
    };

    await userService.create(dto);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ identififer: 'test', password: '1234' })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.accessToken).toEqual(expect.any(String));
      });
  });
  it('로그인 실패', async () => {
    const dto: CreateUserDto = {
      identififer: 'test',
      password: '1234',
    };

    await userService.create(dto);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ identififer: 'test', password: 'wrong' })
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
