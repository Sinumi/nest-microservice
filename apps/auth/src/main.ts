import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
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
          groupId: 'auth-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
