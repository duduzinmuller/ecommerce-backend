import { faker } from "@faker-js/faker";
import { RemoveCartItemUseCase } from "../remove-cart-item";
import { RemoveCartItemRepository } from "../../../repositories/cart-items/remove-cart-item";

const mockRemoveCartItemRepository = {
  execute: jest.fn(),
} as jest.Mocked<RemoveCartItemRepository>;

const removeCartItemUseCase = new RemoveCartItemUseCase(
  mockRemoveCartItemRepository,
);

describe("RemoveCartItemUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should remove a cart item successfully", async () => {
    const mockRemovedCartItem = {
      id: faker.string.uuid(),
      cart_id: faker.string.uuid(),
      product_id: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const itemId = mockRemovedCartItem.id;

    mockRemoveCartItemRepository.execute.mockResolvedValue(mockRemovedCartItem);

    const result = await removeCartItemUseCase.execute(itemId);

    expect(mockRemoveCartItemRepository.execute).toHaveBeenCalledWith(itemId);
    expect(result).toEqual(mockRemovedCartItem);
  });

  it("should return null when cart item does not exist", async () => {
    const itemId = faker.string.uuid();

    mockRemoveCartItemRepository.execute.mockRejectedValue(
      new Error("Cart Item not found"),
    );

    const result = await removeCartItemUseCase.execute(itemId);

    expect(mockRemoveCartItemRepository.execute).toHaveBeenCalledWith(itemId);
    expect(result).toBeNull();
  });
});
