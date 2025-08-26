import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreateCartController } from "../controllers/carts/create-cart";
import { GetCartByUserIdController } from "../controllers/carts/get-cart-by-user-id";
import { CreateCartRepository } from "../repositories/carts/create-cart";
import { GetCartByUserIdRepository } from "../repositories/carts/get-cart-by-user-id";
import { GetUserByIdRepository } from "../repositories/users/get-user-by-id";
import { CreateCartUseCase } from "../use-cases/carts/create-cart";
import { GetCartByUserIdUseCase } from "../use-cases/carts/get-cart-by-user-id";

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

export const MakeGetCartByUserIdController = () => {
  const getCartByUserIdRepository = new GetCartByUserIdRepository();
  const getCartByUserIdUseCase = new GetCartByUserIdUseCase(
    getCartByUserIdRepository,
  );
  const getCartByUserIdController = new GetCartByUserIdController(
    getCartByUserIdUseCase,
  );
  return getCartByUserIdController;
};
