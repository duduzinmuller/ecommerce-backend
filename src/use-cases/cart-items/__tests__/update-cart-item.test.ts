import { faker } from "@faker-js/faker";
import { UpdateCartItemUseCase } from "../update-cart-item";
import { UpdateCartItemRepository } from "../../../repositories/cart-items/update-cart-item";

const mockUpdateCartItemRepository = {
  execute: jest.fn(),
} as jest.Mocked<UpdateCartItemRepository>;

const updateCartItemUseCase = new UpdateCartItemUseCase(
  mockUpdateCartItemRepository,
);

describe("UpdateCartItemUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a cart item successfully", async () => {
    const mockUpdatedCartItem = {
      id: faker.string.uuid(),
      cart_id: faker.string.uuid(),
      product_id: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const itemId = mockUpdatedCartItem.id;
    const quantity = mockUpdatedCartItem.quantity;

    mockUpdateCartItemRepository.execute.mockResolvedValue(
      mockUpdatedCartItem as any,
    );

    const result = await updateCartItemUseCase.execute(itemId, quantity);

    expect(mockUpdateCartItemRepository.execute).toHaveBeenCalledWith(
      itemId,
      quantity,
    );
    expect(result).toEqual(mockUpdatedCartItem);
  });

  it("should return null when cart item does not exist", async () => {
    const itemId = faker.string.uuid();
    const quantity = faker.number.int({ min: 1, max: 10 });

    mockUpdateCartItemRepository.execute.mockResolvedValue(null);

    const result = await updateCartItemUseCase.execute(itemId, quantity);

    expect(mockUpdateCartItemRepository.execute).toHaveBeenCalledWith(
      itemId,
      quantity,
    );
    expect(result).toBeNull();
  });
});
