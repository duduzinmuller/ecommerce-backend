import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreateOrderController } from "../controllers/orders/create-order";
import { GetCartByUserIdRepository } from "../repositories/carts/get-cart-by-user-id";
import { ClearCartRepository } from "../repositories/carts/clear-cart";
import { CreateOrderRepository } from "../repositories/orders/create-order";
import { CreateOrderItemsRepository } from "../repositories/orders/create-order-items";
import { GetUserByIdRepository } from "../repositories/users/get-user-by-id";
import { CreateOrderUseCase } from "../use-cases/orders/create-order";
import { GetOrderByUserIdRepository } from "../repositories/orders/get-order-by-user-id";
import { GetOrderByUserIdUseCase } from "../use-cases/orders/get-order-by-user-id";
import { GetOrderByUserIdController } from "../controllers/orders/get-order-by-user-id";
import { UpdateOrderRepository } from "../repositories/orders/update-order";
import { UpdateOrderUseCase } from "../use-cases/orders/update-order";
import { UpdateOrderController } from "../controllers/orders/update-order";
import { DeleteOrderRepository } from "../repositories/orders/delete-order";
import { DeleteOrderUseCase } from "../use-cases/orders/delete-order";
import { DeleteOrderController } from "../controllers/orders/delete-order";

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

export const MakeGetOrderByUserIdController = () => {
  const getOrderByUserIdRepository = new GetOrderByUserIdRepository();
  const getOrderByUserIdUseCase = new GetOrderByUserIdUseCase(
    getOrderByUserIdRepository,
  );
  const getOrderByUserIdController = new GetOrderByUserIdController(
    getOrderByUserIdUseCase,
  );
  return getOrderByUserIdController;
};

export const MakeUpdateOrderController = () => {
  const updateOrderRepository = new UpdateOrderRepository();
  const updateOrderUseCase = new UpdateOrderUseCase(updateOrderRepository);
  const updateOrderController = new UpdateOrderController(updateOrderUseCase);
  return updateOrderController;
};

export const MakeDeleteOrderController = () => {
  const deleteOrderRepository = new DeleteOrderRepository();
  const deleteOrderUseCase = new DeleteOrderUseCase(deleteOrderRepository);
  const deleteOrderController = new DeleteOrderController(deleteOrderUseCase);
  return deleteOrderController;
};
