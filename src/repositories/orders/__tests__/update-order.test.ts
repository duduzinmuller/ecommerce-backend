import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { UpdateOrderRepository } from "../update-order";
import { faker } from "@faker-js/faker";

const mockDb = {
  update: jest.fn(),
  select: jest.fn(),
};

const mockOrder = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  total: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
  status: "completed",
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};

describe("UpdateOrderRepository", () => {
  let updateOrderRepository: UpdateOrderRepository;

  beforeEach(() => {
    updateOrderRepository = new UpdateOrderRepository(mockDb as any);
    jest.clearAllMocks();
  });

  it("should update an order successfully", async () => {
    const orderId = faker.string.uuid();
    const userId = faker.string.uuid();
    const newStatus = "completed";

    const mockUpdate = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockOrder]),
    };

    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue([mockOrder]),
    };

    mockDb.update.mockReturnValue(mockUpdate);
    mockDb.select.mockReturnValue(mockSelect);

    const result = await updateOrderRepository.execute(
      orderId,
      userId,
      newStatus,
    );

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockUpdate.set).toHaveBeenCalledWith({
      status: newStatus,
      updatedAt: expect.any(Date),
    });
    expect(mockUpdate.where).toHaveBeenCalled();
    expect(mockUpdate.returning).toHaveBeenCalled();
    expect(result).toEqual(mockOrder);
  });

  it("should throw error when order not found", async () => {
    const orderId = faker.string.uuid();
    const userId = faker.string.uuid();
    const newStatus = "completed";

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
      updateOrderRepository.execute(orderId, userId, newStatus),
    ).rejects.toThrow("Order not found");
  });
});
