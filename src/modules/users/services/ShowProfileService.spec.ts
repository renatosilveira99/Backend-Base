// Repositórios fake devem ser importados antes do service
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('Should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon',
      surname: 'Doe',
      email: 'jhon@doe.com',
      telephone: '+553570707070',
      socialId: '1W4c5aF',
      password: '123456',
    });

    const profile = await showProfile.execute(user.id);

    expect(profile.name).toBe('Jhon');
    expect(profile.email).toBe('jhon@doe.com');
  });

  it('Should not be able to show the profile from non-existing user', async () => {
    await expect(showProfile.execute(213205065103)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
