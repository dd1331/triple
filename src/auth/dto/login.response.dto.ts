import { GoodBaseDto } from '../../common/good-base.dto';

export class LoginResponseDto extends GoodBaseDto<LoginResponseDto> {
  accessToken: string;
}
