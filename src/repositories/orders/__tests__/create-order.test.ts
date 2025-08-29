import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { CreateOrderRepository } from "../create-order";
import { faker } from "@faker-js/faker";

const mockDb = {
  insert: jest.fn(),
};

const mockOrder = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  total: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
  status: "pending",
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};

describe("CreateOrderRepository", () => {
  let createOrderRepository: CreateOrderRepository;

  beforeEach(() => {
    createOrderRepository = new CreateOrderRepository(mockDb as any);
    jest.clearAllMocks();
  });

  it("should create an order successfully", async () => {
    const mockInsert = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockOrder]),
    };

    mockDb.insert.mockReturnValue(mockInsert);

    const result = await createOrderRepository.execute({
      id: mockOrder.id,
      user_id: mockOrder.user_id,
      total: mockOrder.total,
      status: mockOrder.status,
    });

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockInsert.values).toHaveBeenCalledWith({
      id: mockOrder.id,
      user_id: mockOrder.user_id,
      total: mockOrder.total,
      status: mockOrder.status,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(mockInsert.returning).toHaveBeenCalled();
    expect(result).toEqual(mockOrder);
  });
});
