import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 15)
  identififer: string;

  @IsNotEmpty()
  @Length(6, 20)
  @IsString()
  // TODO: 형식 체크
  password: string;
}
