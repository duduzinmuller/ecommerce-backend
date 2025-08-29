import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { CreateOrderItemsRepository } from "../create-order-items";
import { faker } from "@faker-js/faker";

const mockDb = {
  insert: jest.fn(),
};

const mockOrderItems = [
  {
    id: faker.string.uuid(),
    order_id: faker.string.uuid(),
    product_id: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    price: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
  {
    id: faker.string.uuid(),
    order_id: faker.string.uuid(),
    product_id: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    price: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
];

describe("CreateOrderItemsRepository", () => {
  let createOrderItemsRepository: CreateOrderItemsRepository;

  beforeEach(() => {
    createOrderItemsRepository = new CreateOrderItemsRepository(mockDb as any);
    jest.clearAllMocks();
  });

  it("should create order items successfully", async () => {
    const mockInsert = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue(mockOrderItems),
    };

    mockDb.insert.mockReturnValue(mockInsert);

    const result = await createOrderItemsRepository.execute(mockOrderItems);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockInsert.values).toHaveBeenCalledWith(mockOrderItems);
    expect(mockInsert.returning).toHaveBeenCalled();
    expect(result).toEqual(mockOrderItems);
  });
});
