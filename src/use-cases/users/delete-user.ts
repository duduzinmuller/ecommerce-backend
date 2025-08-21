import { DeleteUserRepository } from "../../repositories/users/delete-user";

export class DeleteUserUseCase {
  constructor(private deleteUserRepository: DeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository;
  }

  async execute(userId: string) {
    const deleteUser = await this.deleteUserRepository.execute(userId);

    return deleteUser;
  }
}
