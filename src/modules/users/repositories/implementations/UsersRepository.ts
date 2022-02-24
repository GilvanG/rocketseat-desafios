import { User } from "../../model/User";
import { IUsersRepository, ICreateUserDTO } from "../IUsersRepository";

class UsersRepository implements IUsersRepository {
  private users: User[];

  private static INSTANCE: UsersRepository;

  private constructor() {
    this.users = [];
  }

  public static getInstance(): UsersRepository {
    if (!UsersRepository.INSTANCE) {
      UsersRepository.INSTANCE = new UsersRepository();
    }

    return UsersRepository.INSTANCE;
  }

  create({ name, email }: ICreateUserDTO): User {
    // Complete aqui
    const user: User = new User();
    Object.assign(user, { name, email });
    this.users.push(user);
    return user;
  }

  findById(id: string): User | undefined {
    // Complete aqui
    const user: User = this.users.find((user) => user.id === id);
    return user;
  }

  findByEmail(email: string): User | undefined {
    const user: User = this.users.find((user) => user.email === email);
    return user;
  }

  turnAdmin(receivedUser: User): User {
    // Complete aqui
    Object.assign(receivedUser, { admin: true });
    return receivedUser;
  }

  list(): User[] {
    return this.users;
  }
}

export { UsersRepository };
