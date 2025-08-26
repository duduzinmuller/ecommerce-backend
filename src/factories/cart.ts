import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreateCartController } from "../controllers/carts/create-cart";
import { CreateCartRepository } from "../repositories/carts/create-cart";
import { GetUserByIdRepository } from "../repositories/users/get-user-by-id";
import { CreateCartUseCase } from "../use-cases/carts/create-cart";

export const MakeCreateCartController = () => {
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const getUserByIdRepository = new GetUserByIdRepository();
  const createCartRepository = new CreateCartRepository();
  const createCartUseCase = new CreateCartUseCase(
    idGeneratorAdapter,
    getUserByIdRepository,
    createCartRepository,
  );
  const createCartController = new CreateCartController(createCartUseCase);
  return createCartController;
};
