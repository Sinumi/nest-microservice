import { CreateUserDto, UpdateUserDto, UsersEntity } from '@app/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  async getUsers() {
    try {
      const users = await this.userRepository.find({
        relations: ['posts'],
      });

      return users;
    } catch (error) {
      return error;
    }
  }

  async getUser(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['posts'],
      });

      if (!user) {
        return 'User not found';
      }

      delete user.password;

      return JSON.stringify(user);
    } catch (error) {
      return error;
    }
  }

  async login(data: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { username: data.username },
      });

      if (!user) {
        return 'User not found';
      }

      const isPasswordValid = await compare(data.password, user.password);

      if (!isPasswordValid) {
        return 'Password is invalid';
      }

      const payload = { username: user.username };

      return {
        accessToken: this.jwtService.sign(payload, {
          expiresIn: '1d',
          secret: process.env.ACCESS_TOKEN_SECRET,
        }),
        refreshToken: this.jwtService.sign(payload, {
          expiresIn: '7d',
          secret: process.env.REFRESH_TOKEN_SECRET,
        }),
      };
    } catch (error) {
      return error;
    }
  }

  async createUser(data: CreateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { username: data.username },
      });

      if (user) {
        return 'User already exists';
      }

      const salt = await genSalt();
      const hashedPassword = await hash(data.password, salt);

      await this.userRepository.save({
        username: data.username,
        password: hashedPassword,
      });

      const payload = { username: data.username };

      return {
        accessToken: this.jwtService.sign(payload, {
          expiresIn: '1d',
          secret: process.env.ACCESS_TOKEN_SECRET,
        }),
        refreshToken: this.jwtService.sign(payload, {
          expiresIn: '7d',
          secret: process.env.REFRESH_TOKEN_SECRET,
        }),
      };
    } catch (error) {
      return error;
    }
  }

  // Only admin can delete user or user can delete himself
  async deleteUser(id: number) {
    try {
      await this.userRepository.delete({ id });

      return `User ${id} deleted`;
    } catch (error) {
      return error;
    }
  }
}
