import { GetCartItemsRepository } from "../../repositories/cart-items/get-cart-items";

export class GetCartItemsUseCase {
  constructor(private getCartItemsRepository: GetCartItemsRepository) {
    this.getCartItemsRepository = getCartItemsRepository;
  }

  async execute(cartId: string) {
    const getCartItems = await this.getCartItemsRepository.execute(cartId);

    return getCartItems;
  }
}
