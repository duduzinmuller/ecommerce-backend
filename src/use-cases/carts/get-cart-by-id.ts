import { GetCartByIdRepository } from "../../repositories/carts/get-cart-by-id";

export class GetCartByIdUseCase {
  constructor(private getCartByIdRepository: GetCartByIdRepository) {
    this.getCartByIdRepository = getCartByIdRepository;
  }
  async execute(cartId: string) {
    const getCartById = await this.getCartByIdRepository.execute(cartId);

    return getCartById;
  }
}
