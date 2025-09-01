import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { RemoveCartItemRepository } from "../remove-cart-item";
import { faker } from "@faker-js/faker";

const mockDb = {
  delete: jest.fn(),
  select: jest.fn(),
};

const mockCartItem = {
  id: faker.string.uuid(),
  cart_id: faker.string.uuid(),
  product_id: faker.string.uuid(),
  quantity: faker.number.int({ min: 1, max: 10 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};

describe("RemoveCartItemRepository", () => {
  let removeCartItemRepository: RemoveCartItemRepository;

  beforeEach(() => {
    removeCartItemRepository = new RemoveCartItemRepository();
    jest.clearAllMocks();
  });

  it("should remove a cart item successfully", async () => {
    const itemId = faker.string.uuid();

    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue([mockCartItem]),
    };

    const mockDelete = {
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockCartItem]),
    };

    mockDb.select.mockReturnValue(mockSelect);
    mockDb.delete.mockReturnValue(mockDelete);

    const result = await removeCartItemRepository.execute(itemId);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDelete.where).toHaveBeenCalled();
    expect(mockDelete.returning).toHaveBeenCalled();
    expect(result).toEqual(mockCartItem);
  });

  it("should throw error when cart item not found", async () => {
    const itemId = faker.string.uuid();

    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue([]),
    };

    mockDb.select.mockReturnValue(mockSelect);

    await expect(removeCartItemRepository.execute(itemId)).rejects.toThrow(
      "Cart item not found",
    );
  });
});
