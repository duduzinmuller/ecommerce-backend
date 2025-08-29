import { faker } from "@faker-js/faker";
import { UpdateOrderUseCase } from "../update-order";
import { UpdateOrderRepository } from "../../../repositories/orders/update-order";

const mockUpdateOrderRepository = {
  execute: jest.fn(),
} as jest.Mocked<UpdateOrderRepository>;

const updateOrderUseCase = new UpdateOrderUseCase(mockUpdateOrderRepository);

describe("UpdateOrderUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update an order successfully", async () => {
    const mockUpdatedOrder = {
      id: faker.string.uuid(),
      user_id: faker.string.uuid(),
      status: "completed",
      total: "35.50",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userId = mockUpdatedOrder.user_id;
    const orderId = mockUpdatedOrder.id;
    const updateParams = {
      user_id: userId,
      status: "completed" as const,
      total: "35.50",
    };

    mockUpdateOrderRepository.execute.mockResolvedValue(
      mockUpdatedOrder as any,
    );

    const result = await updateOrderUseCase.execute(
      userId,
      orderId,
      updateParams,
    );

    expect(mockUpdateOrderRepository.execute).toHaveBeenCalledWith(
      orderId,
      userId,
      {
        status: "completed",
        total: "35.50",
      },
    );
    expect(result).toEqual(mockUpdatedOrder);
  });

  it("should return null when order does not exist", async () => {
    const userId = faker.string.uuid();
    const orderId = faker.string.uuid();
    const updateParams = {
      user_id: userId,
      status: "completed" as const,
    };

    mockUpdateOrderRepository.execute.mockRejectedValue(
      new Error("Order not found"),
    );

    const result = await updateOrderUseCase.execute(
      userId,
      orderId,
      updateParams,
    );

    expect(mockUpdateOrderRepository.execute).toHaveBeenCalledWith(
      orderId,
      userId,
      {
        status: "completed",
      },
    );
    expect(result).toBeNull();
  });
});
