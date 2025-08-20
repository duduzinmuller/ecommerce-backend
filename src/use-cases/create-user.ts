import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { User } from "../types/user";
import { CreateUserRepository } from "../repositories/create-user";

export class CreateUserUseCase {
  constructor(private createUserRepository: CreateUserRepository) {
    this.createUserRepository = createUserRepository;
  }
  async execute(createUserParams: User) {
    const userId = uuidv4();

    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

    const { id, ...restParams } = createUserParams;

    const user: User = {
      id: userId,
      ...restParams,
      password: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return createdUser;
  }
}
