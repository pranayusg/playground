import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.create({
      username: createUserDto.username,
      passwordHash: createUserDto.password,
    });
    await this.save(newUser);
    return newUser;
  }

  async readEmail(username: string) {
    return await this.findOne({ where: { username } });
  }
}
