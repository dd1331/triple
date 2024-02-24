import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

import * as bcrypt from 'bcrypt';
import { GoodBaseEntity } from '../../common/good-base.entity';
import { SALT_OR_ROUNDS } from '../user.constants';

@Entity()
export class User extends GoodBaseEntity<User> {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ length: 15, unique: true })
  identififer: string;

  @Column({ length: 100 })
  private password: string;

  async signup({ password, identififer }: CreateUserDto) {
    const hash = await bcrypt.hash(password, SALT_OR_ROUNDS);

    // TODO: 암호화해서 받기
    this.password = hash;
    this.identififer = identififer;
  }
}
