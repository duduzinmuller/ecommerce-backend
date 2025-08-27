import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { CartNotFoundError, EmptyCartError } from "../../error/cart-item";
import { UserNotFoundError } from "../../error/user";
import { Order } from "../../interfaces/order";
import { GetCartByUserIdRepository } from "../../repositories/carts/get-cart-by-user-id";
import { CreateOrderRepository } from "../../repositories/orders/create-order";
import { GetUserByIdRepository } from "../../repositories/users/get-user-by-id";
import { addDecimalStrings, multiplyDecimalByInt } from "../../utils/money";

export class CreateOrderUseCase {
  constructor(
    private getUserByIdRepository: GetUserByIdRepository,
    private idGeneratorAdapter: IdGeneratorAdapter,
    private createOrderRepository: CreateOrderRepository,
    private getCartByUserIdRepository: GetCartByUserIdRepository,
  ) {
    this.getUserByIdRepository = getUserByIdRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.createOrderRepository = createOrderRepository;
    this.getCartByUserIdRepository = getCartByUserIdRepository;
  }
  async execute(createOrderParams: Order) {
    const orderId = await this.idGeneratorAdapter.execute();

    const userId = await this.getUserByIdRepository.execute(
      createOrderParams.user_id,
    );

    if (!userId) {
      throw new UserNotFoundError("Usuario não encontrado");
    }

    const cart = await this.getCartByUserIdRepository.execute(
      createOrderParams.user_id,
    );

    if (!cart) {
      throw new CartNotFoundError();
    }

    if (cart.items.length === 0) {
      throw new EmptyCartError();
    }

    let total = "0.00";
    for (const item of cart.items) {
      total = addDecimalStrings(
        total,
        multiplyDecimalByInt(item.price, item.quantity),
      );
    }
    const { id, ...restParams } = createOrderParams;

    const order = {
      id: orderId,
      ...restParams,
      total,
    };

    const createdOrder = await this.createOrderRepository.execute(order);

    return createdOrder;
  }
}
