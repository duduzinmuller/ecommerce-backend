import { DeleteOrderRepository } from "../../repositories/orders/delete-order";

export class DeleteOrderUseCase {
  constructor(private deleteOrderRepository: DeleteOrderRepository) {
    this.deleteOrderRepository = deleteOrderRepository;
  }
  async execute(orderId: string, userId: string) {
    const deletedOrder = await this.deleteOrderRepository.execute(
      orderId,
      userId,
    );

    return deletedOrder;
  }
}
