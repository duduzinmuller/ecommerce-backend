import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { User } from "../../types/user";
import { CreateUserRepository } from "../../repositories/users/create-user";
import { GetUserByEmailRepository } from "../../repositories/users/get-user-by-email";
import { EmailAlreadyInUseError } from "../../error/user";
import { IdGenerator } from "../../adapters/id-generator";

export class CreateUserUseCase {
  constructor(
    private createUserRepository: CreateUserRepository,
    private getUserByEmailRepository: GetUserByEmailRepository,
    private idGenerator: IdGenerator,
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.idGenerator = idGenerator;
  }
  async execute(createUserParams: User) {
    const withProvidedEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    );

    if (withProvidedEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email);
    }
    const userId = await this.idGenerator.execute();

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
