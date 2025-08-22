import { User } from "../../types/user";
import { CreateUserRepository } from "../../repositories/users/create-user";
import { GetUserByEmailRepository } from "../../repositories/users/get-user-by-email";
import { EmailAlreadyInUseError } from "../../error/user";
import { PasswordHasher } from "../../adapters/password-hasher";
import { TokensGeneratorAdapter } from "../../adapters/token-generator";
import { IdGeneratorAdapter } from "../../adapters/id-generator";

export class CreateUserUseCase {
  constructor(
    private createUserRepository: CreateUserRepository,
    private getUserByEmailRepository: GetUserByEmailRepository,
    private idGeneratorAdapter: IdGeneratorAdapter,
    private passwordHasher: PasswordHasher,
    private tokensGeneratorAdapter: TokensGeneratorAdapter,
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.passwordHasher = passwordHasher;
    this.tokensGeneratorAdapter = tokensGeneratorAdapter;
  }
  async execute(createUserParams: User) {
    const withProvidedEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    );

    if (withProvidedEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email);
    }
    const userId = await this.idGeneratorAdapter.execute();

    const hashedPassword = await this.passwordHasher.execute(
      createUserParams.password,
    );

    const { id, ...restParams } = createUserParams;

    const user: User = {
      id: userId,
      ...restParams,
      password: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return {
      ...createdUser,
      tokens: this.tokensGeneratorAdapter.execute(userId),
    };
  }
}
