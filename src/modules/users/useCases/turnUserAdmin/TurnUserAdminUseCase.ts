import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
}

class TurnUserAdminUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }: IRequest): User {
    const userRequesting = this.usersRepository.findById(user_id);
    if (!userRequesting) {
      throw new Error("User Not Found");
    }
    this.usersRepository.turnAdmin(userRequesting);
    return userRequesting;
  }
}

export { TurnUserAdminUseCase };
