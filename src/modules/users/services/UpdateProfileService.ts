/* eslint-disable prettier/prettier */
import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: number;
  name: string;
  surname: string;
  telephone: string;
  socialId: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({
    name, email, socialId, surname, telephone, user_id, old_password, password
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado!')
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('Este email já está sendo usado!')
    }

    user.name = name;
    user.surname = surname;
    user.email = email;
    user.socialId = socialId;
    user.telephone = telephone;

    if (password && !old_password) {
      throw new AppError('Por favor informe a senha antiga para atualizar para uma nova!')
    }


    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      )

      if (!checkOldPassword) {
        throw new AppError('Senhas não conferem!')
      }
      user.password = await this.hashProvider.generateHash(password)
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
