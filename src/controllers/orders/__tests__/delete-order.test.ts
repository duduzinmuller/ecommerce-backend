import { faker } from "@faker-js/faker";
import { DeleteOrderController } from "../delete-order";
import { DeleteOrderUseCase } from "../../../use-cases/orders/delete-order";
import { OrderNotFoundOrUnauthorizedError } from "../../../error/order";

const mockDeleteOrderUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<DeleteOrderUseCase>;

const deleteOrderController = new DeleteOrderController(mockDeleteOrderUseCase);

describe("DeleteOrderController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete an order successfully", async () => {
    const mockDeletedOrder = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      status: "cancelled",
      total: parseFloat(faker.commerce.price()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      params: {
        orderId: mockDeletedOrder.id,
      },
      body: {
        user_id: mockDeletedOrder.userId,
      },
    };

    mockDeleteOrderUseCase.execute.mockResolvedValue(mockDeletedOrder as any);

    const result = await deleteOrderController.execute(httpRequest);

    expect(mockDeleteOrderUseCase.execute).toHaveBeenCalledWith(
      mockDeletedOrder.id,
      mockDeletedOrder.userId,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockDeletedOrder);
  });

  it("should return bad request when orderId is missing", async () => {
    const httpRequest = {
      params: {},
      body: {
        user_id: faker.string.uuid(),
      },
    };

    const result = await deleteOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("O ID é obrigatório");
  });

  it("should return bad request when userId is missing", async () => {
    const httpRequest = {
      params: {
        orderId: faker.string.uuid(),
      },
      body: {},
    };

    const result = await deleteOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("ID do usuário não fornecido");
  });

  it("should return not found when order does not exist", async () => {
    const httpRequest = {
      params: {
        orderId: faker.string.uuid(),
      },
      body: {
        user_id: faker.string.uuid(),
      },
    };

    mockDeleteOrderUseCase.execute.mockRejectedValue(
      new Error("Order not found"),
    );

    const result = await deleteOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body).toBe("Pedido não encontrado");
  });

  it("should return bad request for order not found or unauthorized", async () => {
    const httpRequest = {
      params: {
        orderId: faker.string.uuid(),
      },
      body: {
        user_id: faker.string.uuid(),
      },
    };

    mockDeleteOrderUseCase.execute.mockRejectedValue(
      new OrderNotFoundOrUnauthorizedError(),
    );

    const result = await deleteOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("Pedido não encontrado ou não autorizado");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        orderId: faker.string.uuid(),
      },
      body: {
        user_id: faker.string.uuid(),
      },
    };

    mockDeleteOrderUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await deleteOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
