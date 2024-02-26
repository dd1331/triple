import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { SignupResponseDto } from '../dto/signup.response.dto';
import { UserService } from '../service/user.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '가입 성공',
    type: SignupResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 존재하는 아이디',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효하지 않은 데이터',
  })
  @Post()
  async signup(@Body() createUserDto: CreateUserDto) {
    const res = await this.userService.signup(createUserDto);

    return new SignupResponseDto(res);
  }
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwODkyMDM0NiwiZXhwIjoxNzA5MDA2NzQ2fQ.jQck0H1N5CY3t2VdONyFera6r5_ccVXa7Z9yBELeWeg
