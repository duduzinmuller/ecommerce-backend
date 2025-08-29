import { faker } from "@faker-js/faker";
import { GetCartItemsUseCase } from "../get-cart-items";
import { GetCartItemsRepository } from "../../../repositories/cart-items/get-cart-items";

const mockGetCartItemsRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetCartItemsRepository>;

const getCartItemsUseCase = new GetCartItemsUseCase(mockGetCartItemsRepository);

describe("GetCartItemsUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get cart items successfully", async () => {
    const mockCartItems = [
      {
        id: faker.string.uuid(),
        cart_id: faker.string.uuid(),
        product_id: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: faker.string.uuid(),
        cart_id: faker.string.uuid(),
        product_id: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const cartId = faker.string.uuid();

    mockGetCartItemsRepository.execute.mockResolvedValue(mockCartItems);

    const result = await getCartItemsUseCase.execute(cartId);

    expect(mockGetCartItemsRepository.execute).toHaveBeenCalledWith(cartId);
    expect(result).toEqual(mockCartItems);
  });

  it("should return empty array when no cart items exist", async () => {
    const cartId = faker.string.uuid();

    mockGetCartItemsRepository.execute.mockResolvedValue([]);

    const result = await getCartItemsUseCase.execute(cartId);

    expect(mockGetCartItemsRepository.execute).toHaveBeenCalledWith(cartId);
    expect(result).toEqual([]);
  });
});
