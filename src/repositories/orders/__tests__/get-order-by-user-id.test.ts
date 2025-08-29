import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { GetOrderByUserIdRepository } from "../get-order-by-user-id";
import { faker } from "@faker-js/faker";

const mockDb = {
  select: jest.fn(),
};

const mockOrders = [
  {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    total: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
    status: "pending",
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
  {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    total: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
    status: "completed",
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
];

describe("GetOrderByUserIdRepository", () => {
  let getOrderByUserIdRepository: GetOrderByUserIdRepository;

  beforeEach(() => {
    getOrderByUserIdRepository = new GetOrderByUserIdRepository(mockDb as any);
    jest.clearAllMocks();
  });

  it("should get orders by user id successfully", async () => {
    const userId = faker.string.uuid();
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue(mockOrders),
    };

    mockDb.select.mockReturnValue(mockSelect);

    const result = await getOrderByUserIdRepository.execute(userId);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockSelect.from).toHaveBeenCalled();
    expect(mockSelect.where).toHaveBeenCalled();
    expect(mockSelect.eq).toHaveBeenCalledWith(expect.any(Object), userId);
    expect(result).toEqual(mockOrders);
  });

  it("should return empty array when no orders found", async () => {
    const userId = faker.string.uuid();
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue([]),
    };

    mockDb.select.mockReturnValue(mockSelect);

    const result = await getOrderByUserIdRepository.execute(userId);

    expect(result).toEqual([]);
  });
});
