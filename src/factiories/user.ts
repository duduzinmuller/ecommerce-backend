import { IdGenerator } from "../adapters/id-generator";
import { CreateUserController } from "../controllers/users/create-user";
import { CreateUserRepository } from "../repositories/users/create-user";
import { GetUserByEmailRepository } from "../repositories/users/get-user-by-email";
import { CreateUserUseCase } from "../use-cases/users/create-user";

export const MakeCreateUserController = () => {
  const createUserRepository = new CreateUserRepository();
  const getUserByEmailRepository = new GetUserByEmailRepository();
  const idGenerator = new IdGenerator();
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
    idGenerator,
  );
  const createUserController = new CreateUserController(createUserUseCase);
  return createUserController;
};
