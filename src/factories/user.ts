import { IdGenerator } from "../adapters/id-generator";
import { PasswordComparatorAdapter } from "../adapters/password-comparator";
import { PasswordHasher } from "../adapters/password-hasher";
import { TokensGeneratorAdapter } from "../adapters/token-generator";
import { CreateUserController } from "../controllers/users/create-user";
import { DeleteUserController } from "../controllers/users/delete-user";
import { GetUserByIdController } from "../controllers/users/get-user-by-id";
import { LoginUserController } from "../controllers/users/login-user";
import { CreateUserRepository } from "../repositories/users/create-user";
import { DeleteUserRepository } from "../repositories/users/delete-user";
import { GetUserByEmailRepository } from "../repositories/users/get-user-by-email";
import { GetUserByIdRepository } from "../repositories/users/get-user-by-id";
import { CreateUserUseCase } from "../use-cases/users/create-user";
import { DeleteUserUseCase } from "../use-cases/users/delete-user";
import { GetUserByIdUseCase } from "../use-cases/users/get-user-by-id";
import { LoginUserUseCase } from "../use-cases/users/login-user";

export const MakeCreateUserController = () => {
  const createUserRepository = new CreateUserRepository();
  const getUserByEmailRepository = new GetUserByEmailRepository();
  const idGenerator = new IdGenerator();
  const passwordHasher = new PasswordHasher();
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
    idGenerator,
    passwordHasher,
    tokensGeneratorAdapter,
  );
  const createUserController = new CreateUserController(createUserUseCase);
  return createUserController;
};

export const MakeGetUserByIdController = () => {
  const getUserByIdRepository = new GetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

  return getUserByIdController;
};

export const MakeDeleteUserController = () => {
  const deleteUserRepository = new DeleteUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);
  return deleteUserController;
};

export const MakeLoginUserController = () => {
  const getUserByEmailRepository = new GetUserByEmailRepository();
  const passwordComparatorAdapter = new PasswordComparatorAdapter();
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();
  const loginUserUseCase = new LoginUserUseCase(
    getUserByEmailRepository,
    passwordComparatorAdapter,
    tokensGeneratorAdapter,
  );
  const loginUserController = new LoginUserController(loginUserUseCase);
  return loginUserController;
};
