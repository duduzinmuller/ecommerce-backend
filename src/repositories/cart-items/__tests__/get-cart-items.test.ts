import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { GetCartItemsRepository } from "../get-cart-items";
import { faker } from "@faker-js/faker";

const mockDb = {
  select: jest.fn(),
};

const mockCartItems = [
  {
    id: faker.string.uuid(),
    cart_id: faker.string.uuid(),
    product_id: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
  {
    id: faker.string.uuid(),
    cart_id: faker.string.uuid(),
    product_id: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
];

describe("GetCartItemsRepository", () => {
  let getCartItemsRepository: GetCartItemsRepository;

  beforeEach(() => {
    getCartItemsRepository = new GetCartItemsRepository(mockDb as any);
    jest.clearAllMocks();
  });

  it("should get cart items by cart id successfully", async () => {
    const cartId = faker.string.uuid();
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(mockCartItems),
    };

    mockDb.select.mockReturnValue(mockSelect);

    const result = await getCartItemsRepository.execute(cartId);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockSelect.from).toHaveBeenCalled();
    expect(mockSelect.innerJoin).toHaveBeenCalled();
    expect(mockSelect.where).toHaveBeenCalled();
    expect(result).toEqual(mockCartItems);
  });

  it("should return empty array when no cart items found", async () => {
    const cartId = faker.string.uuid();
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    };

    mockDb.select.mockReturnValue(mockSelect);

    const result = await getCartItemsRepository.execute(cartId);

    expect(result).toEqual([]);
  });
});
