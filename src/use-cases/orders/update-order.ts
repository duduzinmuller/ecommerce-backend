import { OrderParams } from "../../interfaces/order";
import { UpdateOrderRepository } from "../../repositories/orders/update-order";

export class UpdateOrderUseCase {
  constructor(private updateOrderRepository: UpdateOrderRepository) {
    this.updateOrderRepository = updateOrderRepository;
  }

  async execute(
    userId: string,
    orderId: string,
    updateOrderParams: OrderParams,
  ) {
    const { user_id: _ignored, ...safeParams } = updateOrderParams;
    const updatedOrder = await this.updateOrderRepository.execute(
      orderId,
      userId,
      safeParams,
    );
    return updatedOrder;
  }
}
