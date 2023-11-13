import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { PostsModule } from './posts.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PostsModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
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
  );
  await app.listen();
}
bootstrap();
