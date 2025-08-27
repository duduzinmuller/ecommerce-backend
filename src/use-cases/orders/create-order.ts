import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { UserNotFoundError } from "../../error/user";
import { Order } from "../../interfaces/order";
import { CreateOrderRepository } from "../../repositories/orders/create-order";
import { GetUserByIdRepository } from "../../repositories/users/get-user-by-id";

export class CreateOrderUseCase {
  constructor(
    private getUserByIdRepository: GetUserByIdRepository,
    private idGeneratorAdapter: IdGeneratorAdapter,
    private createOrderRepository: CreateOrderRepository,
  ) {
    this.getUserByIdRepository = getUserByIdRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.createOrderRepository = createOrderRepository;
  }
  async execute(createOrderParams: Order) {
    const orderId = await this.idGeneratorAdapter.execute();

    const userId = await this.getUserByIdRepository.execute(
      createOrderParams.user_id,
    );

    if (!userId) {
      throw new UserNotFoundError("Usuario não encontrado");
    }

    const { id, ...restParams } = createOrderParams;

    const order = {
      id: orderId,
      ...restParams,
    };

    const createdOrder = await this.createOrderRepository.execute(order);

    return createdOrder;
  }
}
