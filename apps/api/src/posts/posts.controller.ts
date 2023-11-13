import { AuthGuard, CreatePostDto, UpdatePostDto } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

// ! Routes: /posts(get, post), /posts/:id(get, patch, delete)

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController implements OnModuleInit {
  constructor(
    @Inject('POSTS_SERVICE') private readonly postsClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.postsClient.subscribeToResponseOf('get_posts');
    this.postsClient.subscribeToResponseOf('get_post');
    await this.postsClient.connect();
  }

  @Get()
  getPosts(@Query('userId') userId: number) {
    return this.postsClient.send('get_posts', userId || '');
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    this.postsClient.emit('create_post', JSON.stringify(createPostDto));
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsClient.send('get_post', id);
  }

  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    this.postsClient.emit(
      'update_post',
      JSON.stringify({ id, ...updatePostDto }),
    );
  }

  @Delete(':id')
  deletePost(@Param('id') id: string, @Request() req: any) {
    this.postsClient.emit(
      'delete_post',
      JSON.stringify({ id, user: req.user }),
    );
    return 'Post deleted';
  }
}
