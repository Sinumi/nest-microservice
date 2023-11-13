import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db', // If you are using docker-compose, use the service name here MF!
      port: 5432,
      username: 'postgres',
      password: 'Munis-DB',
      database: 'blogbuddy',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class PostgresDBModule {}
