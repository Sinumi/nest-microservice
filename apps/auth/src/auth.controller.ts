import { CreateUserDto, UpdateUserDto } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('sign_in')
  signIn(@Payload() data: UpdateUserDto) {
    return this.authService.login(data);
  }

  @MessagePattern('sign_up')
  signUp(@Payload() data: CreateUserDto) {
    return this.authService.createUser(data);
  }

  @MessagePattern('get_profile')
  getProfile(@Payload() { id }: { id: number }) {
    return this.authService.getUser(id);
  }

  @MessagePattern('delete_profile')
  deleteUser(@Payload() { id }: { id: number }) {
    return this.authService.deleteUser(id);
  }

  @MessagePattern('get_users')
  getUsers() {
    return this.authService.getUsers();
  }

  @MessagePattern('get_user')
  getUser(@Payload() { id }: { id: number }) {
    return this.authService.getUser(id);
  }
}
