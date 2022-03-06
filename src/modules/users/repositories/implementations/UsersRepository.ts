import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    // Complete usando ORM
    const id = user_id;
    const user = await this.repository.findOne(id, { relations: ['games'] });
    if (user) {
      return user;
    }
    throw new Error(`Not Found`);
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query('SELECT * FROM users ORDER BY first_name ASC'); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    console.log({ first_name, last_name });
    return this.repository.query(
      `SELECT * FROM users WHERE first_name = INITCAP(LOWER('${first_name}')) AND last_name = INITCAP(LOWER('${last_name}'))`
    ); // Complete usando raw query
  }
}
