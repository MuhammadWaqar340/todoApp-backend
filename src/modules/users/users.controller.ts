import {
  Controller,
  Body,
  Get,
  Req,
  Res,
  Patch,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  Post,
  Param,
  Put,
  ConsoleLogger,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  res: any;
  constructor(private readonly userService: UsersService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    const user = await this.userService.create(createUserDto);
    return res.status(200).send({
      data: user,
      message: `User has been created (${user?.firstName})`,
    });
  }
}
