import { UpdateCartItemRepository } from "../../repositories/cart-items/update-cart-item";

export class UpdateCartItemUseCase {
  constructor(private updateCartItemRepository: UpdateCartItemRepository) {
    this.updateCartItemRepository = updateCartItemRepository;
  }

  async execute(itemId: string, quantity: number) {
    const updatedCartItem = await this.updateCartItemRepository.execute(
      itemId,
      quantity,
    );

    return updatedCartItem;
  }
}
