import { CreateCartItemRepository } from "../../repositories/cart-items/create-cart-item";
import { CreateCartItemRequest } from "../../interfaces/cart-item";
import { IdGeneratorAdapter } from "../../adapters/id-generator";
import {
  IdCartAndProductId,
  QuantityProductError,
} from "../../error/cart-item";

export class CreateCartItemUseCase {
  constructor(
    private createCartItemRepository: CreateCartItemRepository,
    private idGeneratorAdapter: IdGeneratorAdapter,
  ) {
    this.createCartItemRepository = createCartItemRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }

  async execute(data: CreateCartItemRequest) {
    const cartItemId = await this.idGeneratorAdapter.execute();

    if (!data.cart_id || !data.product_id) {
      throw new IdCartAndProductId();
    }

    if (data.quantity <= 0) {
      throw new QuantityProductError();
    }

    const { id, ...restParams } = data;

    const cartItems = {
      id: cartItemId,
      ...restParams,
    };

    const createdCartItem =
      await this.createCartItemRepository.execute(cartItems);

    return createdCartItem;
  }
}
