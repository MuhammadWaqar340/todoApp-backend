import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // private readonly paginationService: PaginationService
  ) {}
  async findAll(query: any) {
    return await this.userModel.find();
  }

  async findOne(field: string, value: string): Promise<User> {
    return await await this.userModel.findOne({ [field]: value });
  }

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    const { email } = createUserDto;
    const existedUser = await this.userModel.findOne({ email });
    if (existedUser) {
      throw new ConflictException('Email already exists');
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    });

    return newUser;
  }
}
