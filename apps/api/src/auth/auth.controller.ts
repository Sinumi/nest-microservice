import { AuthGuard, CreateUserDto, UpdateUserDto } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

// ! Routes: /auth/sign-in, /auth/sign-up, /profile(get, patch, delete)

@Controller('')
export class AuthController implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('sign_in');
    this.authClient.subscribeToResponseOf('sign_up');
    this.authClient.subscribeToResponseOf('get_profile');
    this.authClient.subscribeToResponseOf('update_profile');
    this.authClient.subscribeToResponseOf('delete_profile');
    this.authClient.subscribeToResponseOf('get_users');
    this.authClient.subscribeToResponseOf('get_user');
    await this.authClient.connect();
  }

  @Post('auth/sign-in')
  signIn(@Body() signInDto: UpdateUserDto) {
    return this.authClient.send('sign_in', JSON.stringify(signInDto));
  }

  @Post('auth/sign-up')
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authClient.send('sign_up', JSON.stringify(signUpDto));
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.authClient.send(
      'get_profile',
      JSON.stringify({ id: req.user.sub }),
    );
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateUserDto) {
    return this.authClient.send(
      'update_profile',
      JSON.stringify({ id: req.user.sub, ...updateProfileDto }),
    );
  }

  @UseGuards(AuthGuard)
  @Delete('profile')
  deleteProfile(@Request() req: any) {
    return this.authClient.send(
      'delete_profile',
      JSON.stringify({ id: req.user.sub }),
    );
  }

  @Get('users')
  getUsers() {
    return this.authClient.send('get_users', '');
  }

  @Get('users/:id')
  getUser(@Request() req: any) {
    return this.authClient.send('get_user', JSON.stringify(req.params));
  }
}
