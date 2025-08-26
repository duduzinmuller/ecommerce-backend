import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { UserNotFoundError } from "../../error/user";
import { Cart } from "../../interfaces/cart";
import { CreateCartRepository } from "../../repositories/carts/create-cart";
import { GetUserByIdRepository } from "../../repositories/users/get-user-by-id";

export class CreateCartUseCase {
  constructor(
    private idGeneratorAdapter: IdGeneratorAdapter,
    private getUserByIdRepository: GetUserByIdRepository,
    private createCartRepository: CreateCartRepository,
  ) {
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.getUserByIdRepository = getUserByIdRepository;
    this.createCartRepository = createCartRepository;
  }
  async execute(createCartParams: Cart) {
    const cartId = await this.idGeneratorAdapter.execute();

    const user = await this.getUserByIdRepository.execute(
      createCartParams.user_id,
    );

    if (!user) {
      throw new UserNotFoundError("Usuario não encontrado");
    }

    const { id, ...restParams } = createCartParams;

    const cart = {
      id: cartId,
      ...restParams,
    };

    const createdCart = await this.createCartRepository.execute(cart);

    return createdCart;
  }
}
