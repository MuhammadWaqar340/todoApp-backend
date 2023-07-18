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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';

@Controller('user')
export class UsersController {
  res: any;
  constructor(private readonly userService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'List of all Users',
    type: [User],
  })
  @ApiOperation({
    summary: 'Get All Users',
  })
  @Get()
  async findAll(@Req() req, @Res() res, @Query() query) {
    const users = await this.userService.findAll(query);
    return res.status(200).send(users);
  }

  @ApiResponse({
    status: 200,
    description: 'List of all Users',
    type: [User],
  })
  @ApiOperation({
    summary: 'Get All Users',
  })
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id, @Res() res) {
    const user = await this.userService.findOne('_id', id);

    return res.status(200).send({
      data: user,
      message: 'Single user',
    });
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    const user = await this.userService.create(createUserDto);
    return res.status(200).send({
      data: user,
      message: `User has been created (${user?.firstName})`,
    });
  }
}
