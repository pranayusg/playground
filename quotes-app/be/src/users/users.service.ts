import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repositary';

@Injectable()
export class UsersService {
  private saltOrRounds = 10;
  constructor(
    @InjectRepository(UserRepository)
    private repository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      this.saltOrRounds,
    );
    return await this.repository.createUser(createUserDto);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    return await this.repository.findOne({ where: { id: id } });
  }

  async readEmail(email: string) {
    return await this.repository.findOne({ where: { email: email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.repository.findOne({
      where: { id: id },
    });

    if (!existingUser) {
      throw new NotFoundException(
        `Quote with Id:${id} is not found in the database`,
      );
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        this.saltOrRounds,
      );
    }
    await this.repository.update({ id }, updateUserDto);
    return await this.repository.findOne({ id });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
