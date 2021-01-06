// Repositórios fake devem ser importados antes do service
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Jhon',
      surname: 'Doe',
      email: 'jhon@doe.com',
      telephone: '+553570707070',
      socialId: '1W4c5aF',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(typeof user.id).toBe('number');
  });

  it('Should not be able to create two users with same email', async () => {
    await createUser.execute({
      name: 'Jhon',
      surname: 'Doe',
      email: 'jhon@doe.com',
      telephone: '+553570707070',
      socialId: '1W4c5aF',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Jhon',
        surname: 'Doe',
        email: 'jhon@doe.com',
        telephone: '+553570707070',
        socialId: '1W4c5aF',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
