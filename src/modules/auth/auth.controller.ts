import {
  Controller,
  Body,
  Post,
  Response,
  Request,
  UseGuards,
  BadRequestException,
  Patch,
  Res,
  Req,
} from '@nestjs/common';

import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ErrorResponseDto } from './dto/error-response.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiResponse({
  status: 401,
  description: 'Unauthorized.',
  type: ErrorResponseDto,
})
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The user registered',
    type: LoginResponseDto,
  })
  @ApiOperation({
    summary: 'User Registration',
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);

    const loginResponseDto = await this.authService.login(newUser);

    return loginResponseDto;
  }
}
