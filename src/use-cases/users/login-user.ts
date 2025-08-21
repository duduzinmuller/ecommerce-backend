import { PasswordComparatorAdapter } from "../../adapters/password-comparator";
import { TokensGeneratorAdapter } from "../../adapters/token-generator";
import { InvalidPasswordError, UserNotFoundError } from "../../error/user";
import { GetUserByEmailRepository } from "../../repositories/users/get-user-by-email";

export class LoginUserUseCase {
  constructor(
    private getUserByEmailRepository: GetUserByEmailRepository,
    private passwordComparatorAdapter: PasswordComparatorAdapter,
    private tokensGeneratorAdapter: TokensGeneratorAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordComparatorAdapter = passwordComparatorAdapter;
    this.tokensGeneratorAdapter = tokensGeneratorAdapter;
  }
  async execute(email: string, password: string) {
    const user = await this.getUserByEmailRepository.execute(email);

    if (!user) {
      throw new UserNotFoundError("Usuario não encontrado");
    }

    const isPasswordValid = await this.passwordComparatorAdapter.execute(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidPasswordError();
    }

    return {
      ...user,
      tokens: this.tokensGeneratorAdapter.execute(user.id),
    };
  }
}
