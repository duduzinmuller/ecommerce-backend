import { CreateCartItemController } from "../controllers/cart-items/create-cart-item";
import { GetCartItemsController } from "../controllers/cart-items/get-cart-items";
import { UpdateCartItemController } from "../controllers/cart-items/update-cart-item";
import { RemoveCartItemController } from "../controllers/cart-items/remove-cart-item";

import { CreateCartItemRepository } from "../repositories/cart-items/create-cart-item";
import { GetCartItemsRepository } from "../repositories/cart-items/get-cart-items";
import { UpdateCartItemRepository } from "../repositories/cart-items/update-cart-item";
import { RemoveCartItemRepository } from "../repositories/cart-items/remove-cart-item";

import { CreateCartItemUseCase } from "../use-cases/cart-items/create-cart-item";
import { GetCartItemsUseCase } from "../use-cases/cart-items/get-cart-items";
import { UpdateCartItemUseCase } from "../use-cases/cart-items/update-cart-item";
import { RemoveCartItemUseCase } from "../use-cases/cart-items/remove-cart-item";
import { IdGeneratorAdapter } from "../adapters/id-generator";

export const MakeCreateCartItemController = () => {
  const createCartItemRepository = new CreateCartItemRepository();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const createCartItemUseCase = new CreateCartItemUseCase(
    createCartItemRepository,
    idGeneratorAdapter,
  );
  const createCartItemController = new CreateCartItemController(
    createCartItemUseCase,
  );
  return createCartItemController;
};

export const MakeGetCartItemsController = () => {
  const getCartItemsRepository = new GetCartItemsRepository();
  const getCartItemsUseCase = new GetCartItemsUseCase(getCartItemsRepository);
  const getCartItemsController = new GetCartItemsController(
    getCartItemsUseCase,
  );
  return getCartItemsController;
};

export const MakeUpdateCartItemController = () => {
  const updateCartItemRepository = new UpdateCartItemRepository();
  const updateCartItemUseCase = new UpdateCartItemUseCase(
    updateCartItemRepository,
  );
  const updateCartItemController = new UpdateCartItemController(
    updateCartItemUseCase,
  );
  return updateCartItemController;
};

export const MakeRemoveCartItemController = () => {
  const removeCartItemRepository = new RemoveCartItemRepository();
  const removeCartItemUseCase = new RemoveCartItemUseCase(
    removeCartItemRepository,
  );
  const removeCartItemController = new RemoveCartItemController(
    removeCartItemUseCase,
  );
  return removeCartItemController;
};
