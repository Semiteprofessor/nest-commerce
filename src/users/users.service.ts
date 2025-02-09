import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const existingUser = await this.findUserByEmail(userSignUpDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const user = this.usersRepository.create(userSignUpDto);
    return await this.usersRepository.save(user);
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}
