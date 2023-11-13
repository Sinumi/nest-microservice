import jwtConfig from '@app/common/config/jwt.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { PostsController } from './posts.controller';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ClientsModule.register([
      {
        name: 'POSTS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'posts',
            brokers: ['kafka:9092'],
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
          consumer: {
            groupId: 'posts-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [PostsController],
})
export class PostsModule {}
