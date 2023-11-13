import { PostgresDBModule, UsersEntity } from '@app/common';
import { PostsEntity } from '@app/common/entities/posts.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    PostgresDBModule,
    TypeOrmModule.forFeature([PostsEntity, UsersEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
