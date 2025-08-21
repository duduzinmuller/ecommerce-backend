import { GetUserByIdRepository } from "../../repositories/users/get-user-by-id";

export class GetUserByIdUseCase {
  constructor(private getUserByIdRepository: GetUserByIdRepository) {
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(userId: string) {
    const getUser = await this.getUserByIdRepository.execute(userId);

    return getUser;
  }
}
