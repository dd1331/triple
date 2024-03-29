import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 15)
  identififer: string;

  @IsNotEmpty()
  @Length(2, 15)
  name: string;

  @IsNotEmpty()
  @Length(6, 20)
  @IsString()
  password: string;
}
