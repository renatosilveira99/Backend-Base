import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class UsersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = parseInt(request.user.id, 10);

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute(user_id);

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = parseInt(request.user.id, 10);
    const {
      name,
      surname,
      telephone,
      socialId,
      email,
      old_password,
      password,
    } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      surname,
      telephone,
      socialId,
      old_password,
      password,
    });

    return response.json(classToClass(user));
  }
}

export default UsersController;
