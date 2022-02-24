import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  name: string;
  email: string;
}

class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ email, name }: IRequest): User {
    let user: User = this.usersRepository.findByEmail(email);
    if (user) {
      throw new Error("User already exists");
      return user;
    }
    user = this.usersRepository.create({ email, name });
    return user;
  }
}

export { CreateUserUseCase };
