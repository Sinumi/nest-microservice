import { CreatePostDto, UpdatePostDto } from '@app/common';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { PostsService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @MessagePattern('get_posts')
  getPosts(query: any) {
    return this.postsService.getPosts(query);
  }

  @MessagePattern('get_post')
  getPost(id: number) {
    return this.postsService.getPost(id);
  }

  @EventPattern('create_post')
  createPost(data: CreatePostDto) {
    return this.postsService.createPost(data);
  }

  @EventPattern('update_post')
  updatePost(data: UpdatePostDto & { id: number }) {
    return this.postsService.updatePost(data);
  }

  @EventPattern('delete_post')
  deletePost(data) {
    return this.postsService.deletePost(data.id, data.sub);
  }
}
