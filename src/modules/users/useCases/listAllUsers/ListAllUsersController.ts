import { Request, Response } from "express";

import { ListAllUsersUseCase } from "./ListAllUsersUseCase";

class ListAllUsersController {
  constructor(private listAllUsersUseCase: ListAllUsersUseCase) {}

  handle(request: Request, response: Response): Response {
    try {
      const { user_id } = request.headers;
      const user_idd: string = user_id as string;
      const users = this.listAllUsersUseCase.execute({ user_id: user_idd });
      return response.send(users);
    } catch (error) {
      return response.status(400).send({ error: error.message });
    }
  }
}

export { ListAllUsersController };
