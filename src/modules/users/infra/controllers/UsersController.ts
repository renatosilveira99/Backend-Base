import CreateUserService from '@modules/users/services/CreateUserService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      surname,
      telephone,
      socialId,
      email,
      password,
    } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      surname,
      telephone,
      socialId,
      password,
    });

    return response.json(classToClass(user));
  }
}

export default UsersController;
