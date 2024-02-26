import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { LoginResponseDto } from '../dto/login.response.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../service/auth.service';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '로그인 실패' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효하지 않은 데이터',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        identififer: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  login(@Request() { user }: { user: User }) {
    const res = this.authService.login(user);

    return new LoginResponseDto(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('guarded')
  findAll() {
    return true;
  }
}
