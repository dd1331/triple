import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Length(2, 15)
  identififer: string;

  @IsNotEmpty()
  @Length(2, 15)
  password: string;
}
