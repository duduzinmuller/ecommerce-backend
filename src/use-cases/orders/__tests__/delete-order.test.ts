import { faker } from "@faker-js/faker";
import { DeleteOrderUseCase } from "../delete-order";
import { DeleteOrderRepository } from "../../../repositories/orders/delete-order";

const mockDeleteOrderRepository = {
  execute: jest.fn(),
} as jest.Mocked<DeleteOrderRepository>;

const deleteOrderUseCase = new DeleteOrderUseCase(mockDeleteOrderRepository);

describe("DeleteOrderUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete an order successfully", async () => {
    const mockDeletedOrder = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      status: "cancelled",
      total: "35.50",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const orderId = mockDeletedOrder.id;
    const userId = mockDeletedOrder.user_id;

    mockDeleteOrderRepository.execute.mockResolvedValue(
      mockDeletedOrder as any,
    );

    const result = await deleteOrderUseCase.execute(orderId, userId);

    expect(mockDeleteOrderRepository.execute).toHaveBeenCalledWith(
      orderId,
      userId,
    );
    expect(result).toEqual(mockDeletedOrder);
  });

  it("should return null when order does not exist", async () => {
    const orderId = faker.string.uuid();
    const userId = faker.string.uuid();

    mockDeleteOrderRepository.execute.mockRejectedValue(
      new Error("Order not found"),
    );

    const result = await deleteOrderUseCase.execute(orderId, userId);

    expect(mockDeleteOrderRepository.execute).toHaveBeenCalledWith(
      orderId,
      userId,
    );
    expect(result).toBeNull();
  });
});
