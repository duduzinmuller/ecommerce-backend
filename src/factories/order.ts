import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreateOrderController } from "../controllers/orders/create-order";
import { GetCartByUserIdRepository } from "../repositories/carts/get-cart-by-user-id";
import { ClearCartRepository } from "../repositories/carts/clear-cart";
import { CreateOrderRepository } from "../repositories/orders/create-order";
import { CreateOrderItemsRepository } from "../repositories/orders/create-order-items";
import { GetUserByIdRepository } from "../repositories/users/get-user-by-id";
import { CreateOrderUseCase } from "../use-cases/orders/create-order";

export const MakeCreateOrderController = () => {
  const getUserByIdRepository = new GetUserByIdRepository();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const createOrderRepository = new CreateOrderRepository();
  const getCartByUserIdRepository = new GetCartByUserIdRepository();
  const createOrderItemsRepository = new CreateOrderItemsRepository(
    idGeneratorAdapter,
  );
  const clearCartRepository = new ClearCartRepository();
  const createOrderUseCase = new CreateOrderUseCase(
    getUserByIdRepository,
    idGeneratorAdapter,
    createOrderRepository,
    getCartByUserIdRepository,
    createOrderItemsRepository,
    clearCartRepository,
  );
  const createOrderController = new CreateOrderController(createOrderUseCase);
  return createOrderController;
};
