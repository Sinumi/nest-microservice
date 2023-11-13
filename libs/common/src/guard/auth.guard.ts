import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromRequest(request);
    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        accessToken,
        this.jwtConfiguration,
      );
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
    return true;
  }

  private extractTokenFromRequest(request: Request) {
    const [, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
