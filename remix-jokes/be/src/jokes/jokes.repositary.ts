import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateJokeDto } from './dto/create-joke.dto';
import { Joke } from './entities/joke.entity';

@EntityRepository(Joke)
export class JokeRepository extends Repository<Joke> {
  async createJoke(createJokeDto: CreateJokeDto, user: User): Promise<Joke> {
    const newJoke = this.create({ ...createJokeDto, jokester: user });
    await this.save(newJoke);
    return newJoke;
  }

  async findRandom(): Promise<Joke> {
    const count = await this.count();
    const randomRowNumber = Math.floor(Math.random() * count);
    const [randomJoke] = await this.find({
      take: 1,
      skip: randomRowNumber,
    });

    return randomJoke;
  }
}
