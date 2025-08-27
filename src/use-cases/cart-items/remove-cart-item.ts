import { RemoveCartItemRepository } from "../../repositories/cart-items/remove-cart-item";

export class RemoveCartItemUseCase {
  constructor(private removeCartItemRepository: RemoveCartItemRepository) {
    this.removeCartItemRepository = removeCartItemRepository;
  }
  async execute(itemId: string) {
    const removedCartItem = await this.removeCartItemRepository.execute(itemId);

    return removedCartItem;
  }
}
