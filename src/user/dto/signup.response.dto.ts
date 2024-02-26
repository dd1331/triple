import { GoodBaseDto } from '../../common/good-base.dto';

export class SignupResponseDto extends GoodBaseDto<SignupResponseDto> {
  userId: number;
}
