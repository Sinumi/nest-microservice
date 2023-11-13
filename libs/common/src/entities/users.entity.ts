import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostsEntity } from './posts.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => PostsEntity, (post) => post.user)
  posts: PostsEntity[];
}
