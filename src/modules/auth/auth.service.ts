import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword, comparePassword } from '../utils/index';
import { UsersService } from '../users/users.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // private readonly emailValidationService: EmailValidationService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // private readonly mailService: MailService
  ) {}

  async validateUser(
    email: string,
    password: string,
    validatePassword = false,
  ): Promise<User> {
    const user = await this.usersService.findOne('email', email);
    if (user && (await comparePassword(password, user.password))) {
      const { password, id, __v, createdAt, updatedAt, ...result } = JSON.parse(
        JSON.stringify(user),
      );
      return result;
    }
    if (validatePassword)
      throw new BadRequestException('Current password is invalid');
    throw new BadRequestException('Invalid email or password');
  }
  async login(user: User): Promise<LoginResponseDto> {
    const payload = { sub: user };
    const expiresIn = 60 * 60 * 24 * 2;

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn,
      }),
      user,
      expiresIn,
    };
  }
}
