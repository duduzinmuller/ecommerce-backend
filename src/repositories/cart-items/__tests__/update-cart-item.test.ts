import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { UpdateCartItemRepository } from "../update-cart-item";
import { faker } from "@faker-js/faker";

const mockDb = {
  update: jest.fn(),
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

describe("UpdateCartItemRepository", () => {
  let updateCartItemRepository: UpdateCartItemRepository;

  beforeEach(() => {
    updateCartItemRepository = new UpdateCartItemRepository(mockDb as any);
    jest.clearAllMocks();
  });

  it("should update a cart item successfully", async () => {
    const itemId = faker.string.uuid();
    const newQuantity = faker.number.int({ min: 1, max: 10 });

    const mockUpdate = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockCartItem]),
    };

    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue([mockCartItem]),
    };

    mockDb.update.mockReturnValue(mockUpdate);
    mockDb.select.mockReturnValue(mockSelect);

    const result = await updateCartItemRepository.execute(itemId, newQuantity);

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockUpdate.set).toHaveBeenCalledWith({
      quantity: newQuantity,
      updatedAt: expect.any(Date),
    });
    expect(mockUpdate.where).toHaveBeenCalled();
    expect(mockUpdate.returning).toHaveBeenCalled();
    expect(result).toEqual(mockCartItem);
  });

  it("should throw error when cart item not found", async () => {
    const itemId = faker.string.uuid();
    const newQuantity = faker.number.int({ min: 1, max: 10 });

    const mockUpdate = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([]),
    };

    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue([]),
    };

    mockDb.update.mockReturnValue(mockUpdate);
    mockDb.select.mockReturnValue(mockSelect);

    await expect(
      updateCartItemRepository.execute(itemId, newQuantity),
    ).rejects.toThrow("Cart item not found");
  });
});
