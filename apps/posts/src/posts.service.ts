import { CreatePostDto, PostsEntity, UpdatePostDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  async getPosts(userId: number) {
    return await this.postsRepository.find(
      userId
        ? {
            where: { user: { id: Number(userId) } },
            relations: ['user'],
          }
        : {
            relations: ['user'],
          },
    );
  }

  async getPost(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) {
      return 'Post not found';
    }

    return post;
  }

  async createPost(data: CreatePostDto) {
    const post = this.postsRepository.create(data);
    return await this.postsRepository.save(post);
  }

  async updatePost(data: UpdatePostDto & { id: number }) {
    const post = await this.postsRepository.findOne({ where: { id: data.id } });

    if (!post) {
      return 'Post not found';
    }

    return await this.postsRepository.update({ id: data.id }, data);
  }

  async deletePost(id: number, sub: number | string) {
    const post = await this.postsRepository.findOne(
      typeof sub === 'number'
        ? { where: { id, user: { id: sub } } }
        : { where: { id, user: { username: sub } } },
    );

    if (!post) {
      return "You don't have permission to delete this post";
    }

    return await this.postsRepository.delete({ id });
  }
}
