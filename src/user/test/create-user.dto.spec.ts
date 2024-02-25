import { fakerKO } from '@faker-js/faker';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from '../dto/create-user.dto';

describe('createUserDto', () => {
  it('성공', async () => {
    const plain: CreateUserDto = {
      identififer: fakerKO.string.alphanumeric(15),
      password: fakerKO.string.alphanumeric(20),
    };

    const dto = plainToClass(CreateUserDto, plain);

    const res = await validate(dto);

    expect(res).toHaveLength(0);
  });

  it('길이 안맞음', async () => {
    const plain: CreateUserDto = {
      identififer: fakerKO.string.alphanumeric(16),
      password: fakerKO.string.alphanumeric(21),
    };

    const dto = plainToClass(CreateUserDto, plain);

    const res = await validate(dto);

    expect(res).toHaveLength(2);
  });

  it('값이 없음', async () => {
    const plain: CreateUserDto = {
      identififer: undefined,
      password: undefined,
    };

    const dto = plainToClass(CreateUserDto, plain);

    const res = await validate(dto);

    expect(res).toHaveLength(2);
  });
});
