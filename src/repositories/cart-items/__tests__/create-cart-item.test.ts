import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { CreateCartItemRepository } from "../create-cart-item";
import { faker } from "@faker-js/faker";

const mockDb = {
  insert: jest.fn(),
};

const mockCartItem = {
  id: faker.string.uuid(),
  cart_id: faker.string.uuid(),
  product_id: faker.string.uuid(),
  quantity: faker.number.int({ min: 1, max: 10 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};

describe("CreateCartItemRepository", () => {
  let createCartItemRepository: CreateCartItemRepository;

  beforeEach(() => {
    createCartItemRepository = new CreateCartItemRepository(mockDb as any);
    jest.clearAllMocks();
  });

  it("should create a cart item successfully", async () => {
    const mockInsert = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockCartItem]),
    };

    mockDb.insert.mockReturnValue(mockInsert);

    const result = await createCartItemRepository.execute({
      id: mockCartItem.id,
      cart_id: mockCartItem.cart_id,
      product_id: mockCartItem.product_id,
      quantity: mockCartItem.quantity,
    });

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockInsert.values).toHaveBeenCalledWith({
      id: mockCartItem.id,
      cart_id: mockCartItem.cart_id,
      product_id: mockCartItem.product_id,
      quantity: mockCartItem.quantity,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(mockInsert.returning).toHaveBeenCalled();
    expect(result).toEqual(mockCartItem);
  });
});
