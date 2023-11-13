import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string' })
  @MinLength(5, { message: 'Username must be at least 5 characters long' })
  username: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  password: string;
}
