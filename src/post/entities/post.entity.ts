import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GoodBaseEntity } from '../../common/good-base.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Post extends GoodBaseEntity<Post> {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column()
  img: string;

  @Column({ name: 'poster_id' })
  posterId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'poster_id' })
  poster: User;
}
