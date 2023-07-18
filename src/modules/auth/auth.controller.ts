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
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { SuccessResponseDto } from './dto/success-response.dto';

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

  @ApiResponse({
    status: 200,
    description: 'The user loggedIn successfully',
    type: LoginResponseDto,
  })
  @ApiOperation({
    summary: 'Login User',
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const validateUser = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    return await this.authService.login(validateUser);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Token verified successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    type: ErrorResponseDto,
  })
  @ApiOperation({
    summary: 'Verify user token',
  })
  @Post('verify-token')
  @UseGuards(AuthGuard('jwt'))
  async verifyToken(@Response() response) {
    return response.send({ message: 'Token verified successfully' });
  }
}
