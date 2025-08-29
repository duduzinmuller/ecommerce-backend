import { DeleteOrderRepository } from "../../repositories/orders/delete-order";

export class DeleteOrderUseCase {
  constructor(private deleteOrderRepository: DeleteOrderRepository) {
    this.deleteOrderRepository = deleteOrderRepository;
  }
  async execute(orderId: string) {
    const deletedOrder = await this.deleteOrderRepository.execute(orderId);

    return deletedOrder;
  }
}
