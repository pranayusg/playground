import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(CreateUserDto: CreateUserDto): Promise<User> {
    const newUser = this.create(CreateUserDto);
    await this.save(newUser);
    delete newUser.password;
    return newUser;
  }
}
