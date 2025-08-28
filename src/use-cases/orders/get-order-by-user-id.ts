import { GetOrderByUserIdRepository } from "src/repositories/orders/get-order-by-user-id";

export class GetOrderByUserIdUseCase {
  constructor(private getOrderByUserIdRepository: GetOrderByUserIdRepository) {
    this.getOrderByUserIdRepository = getOrderByUserIdRepository;
  }
  async execute(userId: string) {
    const getOrderByUserId =
      await this.getOrderByUserIdRepository.execute(userId);
    return getOrderByUserId;
  }
}
