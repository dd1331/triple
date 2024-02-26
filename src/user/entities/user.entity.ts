import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

import * as bcrypt from 'bcrypt';
import { GoodBaseEntity } from '../../common/good-base.entity';
import { Post } from '../../post/entities/post.entity';
import { SALT_OR_ROUNDS } from '../user.constants';

@Entity()
export class User extends GoodBaseEntity<User> {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ length: 15, unique: true })
  identififer: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 100 })
  private password: string;

  @OneToMany(() => Post, ({ poster }) => poster)
  posts: Post[];

  async signup({ password, identififer, name }: CreateUserDto) {
    const hash = await bcrypt.hash(password, SALT_OR_ROUNDS);

    this.password = hash;
    this.identififer = identififer;
    this.name = name;
  }

  async login({ password }: { password: string }) {
    const isValid = await bcrypt.compare(password, this.password);

    if (!isValid) return null;
    return this;
  }
}
