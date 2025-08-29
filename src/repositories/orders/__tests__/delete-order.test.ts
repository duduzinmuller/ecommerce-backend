import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { DeleteOrderRepository } from "../delete-order";
import { faker } from "@faker-js/faker";

const mockDb = {
  delete: jest.fn(),
  select: jest.fn(),
};

const mockOrder = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  total: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
  status: "pending",
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};

describe("DeleteOrderRepository", () => {
  let deleteOrderRepository: DeleteOrderRepository;

  beforeEach(() => {
    deleteOrderRepository = new DeleteOrderRepository(mockDb as any);
    jest.clearAllMocks();
  });

  it("should delete an order successfully", async () => {
    const orderId = faker.string.uuid();
    const userId = faker.string.uuid();

    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue([mockOrder]),
    };

    const mockDelete = {
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockOrder]),
    };

    mockDb.select.mockReturnValue(mockSelect);
    mockDb.delete.mockReturnValue(mockDelete);

    const result = await deleteOrderRepository.execute(orderId, userId);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDelete.where).toHaveBeenCalled();
    expect(mockDelete.returning).toHaveBeenCalled();
    expect(result).toEqual(mockOrder);
  });

  it("should throw error when order not found", async () => {
    const orderId = faker.string.uuid();
    const userId = faker.string.uuid();

    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue([]),
    };

    mockDb.select.mockReturnValue(mockSelect);

    await expect(
      deleteOrderRepository.execute(orderId, userId),
    ).rejects.toThrow("Order not found");
  });
});
