import { fakerKO } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../service/user.service';
import { UserModule } from '../user.module';

describe('User e2e', () => {
  let app: INestApplication;
  let userService: UserService;
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

        UserModule,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);

    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => await app.close());

  it('가입 성공', () => {
    const dto: CreateUserDto = {
      identififer: fakerKO.string.alphanumeric(10),
      password: fakerKO.string.alphanumeric(10),
    };
    return request(app.getHttpServer())
      .post('/users')
      .send(dto)
      .expect(HttpStatus.CREATED)
      .expect((res) => expect(res.body.userId).toEqual(expect.any(Number)));
  });

  it('이미 존재하는 아이디', async () => {
    const dto: CreateUserDto = {
      identififer: fakerKO.string.alphanumeric(10),
      password: fakerKO.string.alphanumeric(10),
    };
    await userService.create(dto);

    return request(app.getHttpServer())
      .post('/users')
      .send(dto)
      .expect(HttpStatus.CONFLICT);
  });
});
