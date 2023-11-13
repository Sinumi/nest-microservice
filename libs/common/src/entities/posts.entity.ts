import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('posts')
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => UsersEntity, (user) => user.posts)
  user: UsersEntity;
}
