import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcryptjs';
import { UserSignInDto } from './dto/user-signin.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOneBy({
      email: userSignUpDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userSignUpDto.password, 10);
    const user = this.usersRepository.create({
      ...userSignUpDto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
  }

  async signIn(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const { email, password } = userSignInDto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    console.log('User from DB:', user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new InternalServerErrorException(
        'User password is missing in database',
      );
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    console.log('User password from DB:', user.password);
    console.log('Password from request:', password);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.usersRepository.find();
  }
  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  accessToken(user: UserEntity): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' },
    );
  }
}
