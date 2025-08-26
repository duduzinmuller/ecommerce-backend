import { GetCartByUserIdRepository } from "../../repositories/carts/get-cart-by-user-id";

export class GetCartByUserIdUseCase {
  constructor(private getCartByUserIdRepository: GetCartByUserIdRepository) {
    this.getCartByUserIdRepository = getCartByUserIdRepository;
  }

  async execute(userId: string) {
    const cart = await this.getCartByUserIdRepository.execute(userId);
    return cart;
  }
}
