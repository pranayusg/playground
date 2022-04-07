import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateJokeDto } from './dto/create-joke.dto';
import { UpdateJokeDto } from './dto/update-joke.dto';
import { JokeRepository } from './jokes.repositary';

@Injectable()
export class JokesService {
  constructor(
    @InjectRepository(JokeRepository)
    private jokeRepository: JokeRepository,
    private usersService: UsersService,
  ) {}

  async create(createJokeDto: CreateJokeDto, userId) {
    const user = await this.usersService.findOne(userId);
    return await this.jokeRepository.createJoke(createJokeDto, user);
  }

  async findAll() {
    return await this.jokeRepository.find({
      take: 5,
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    return await this.jokeRepository.findOne({
      where: { id },
    });
  }

  async findRandom() {
    return await this.jokeRepository.findRandom();
  }

  update(id: number, updateJokeDto: UpdateJokeDto) {
    return `This action updates a #${id} joke`;
  }

  async remove(id: string) {
    const existingJoke = await this.jokeRepository.findOne({
      where: { id },
    });
    if (!existingJoke) {
      throw new NotFoundException(
        `Joke with Id:${id} is not found in the database`,
      );
    }
    const result = await this.jokeRepository.delete(id);
    if (result.affected) return { deleted: true };

    return { deleted: false };
  }
}
