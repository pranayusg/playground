import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repositary';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private saltOrRounds = 10;
  constructor(
    @InjectRepository(UserRepository)
    private repository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      this.saltOrRounds,
    );
    const user = await this.repository.createUser(createUserDto);
    return this.login(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    return await this.repository.findOne({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.repository.readEmail(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (user && isMatch) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      userId: user.id,
      username: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
    };
  }
}
