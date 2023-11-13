import { IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Title must be a string' })
  @MinLength(10, { message: 'Title must be at least 10 characters long' })
  title: string;

  @IsString({ message: 'Content must be a string' })
  content: string;

  @IsString({ message: 'User ID must be a string' })
  userId: string;
}
