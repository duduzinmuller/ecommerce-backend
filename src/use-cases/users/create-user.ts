import { User } from "../../interfaces/user";
import { CreateUserRepository } from "../../repositories/users/create-user";
import { GetUserByEmailRepository } from "../../repositories/users/get-user-by-email";
import { CreateCustomerRepository } from "../../repositories/asaas/create-customer";
import { EmailAlreadyInUseError } from "../../error/user";

import { TokensGeneratorAdapter } from "../../adapters/token-generator";
import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { PasswordHasherAdapter } from "../../adapters/password-hasher";

export class CreateUserUseCase {
  constructor(
    private createUserRepository: CreateUserRepository,
    private getUserByEmailRepository: GetUserByEmailRepository,
    private createCustomerRepository: CreateCustomerRepository,
    private idGeneratorAdapter: IdGeneratorAdapter,
    private passwordHasherAdapter: PasswordHasherAdapter,
    private tokensGeneratorAdapter: TokensGeneratorAdapter,
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.createCustomerRepository = createCustomerRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.passwordHasherAdapter = passwordHasherAdapter;
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

    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    );

    let asaasCustomerId: string | undefined;
    try {
      const asaasCustomer = await this.createCustomerRepository.execute({
        name: createUserParams.name,
        email: createUserParams.email,
        cpfCnpj: "05509867230",
        phone: "69999137501",
        mobilePhone: "69999137501",
      });
      asaasCustomerId = asaasCustomer.id;
    } catch (error) {
      console.log("🔍 Erro detalhado:", error);
    }

    const { id, ...restParams } = createUserParams;

    const user: User = {
      id: userId,
      ...restParams,
      password: hashedPassword,
      asaas_customer_id: asaasCustomerId,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return {
      ...createdUser,
      tokens: this.tokensGeneratorAdapter.execute(userId),
    };
  }
}
