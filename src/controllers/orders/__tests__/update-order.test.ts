import { faker } from "@faker-js/faker";
import { UpdateOrderController } from "../update-order";
import { UpdateOrderUseCase } from "../../../use-cases/orders/update-order";
import { OrderNotFoundOrUnauthorizedError } from "../../../error/order";

const mockUpdateOrderUseCase = {
  execute: jest.fn(),
} as jest.Mocked<UpdateOrderUseCase>;

const updateOrderController = new UpdateOrderController(mockUpdateOrderUseCase);

describe("UpdateOrderController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update an order successfully", async () => {
    const mockUpdatedOrder = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      status: "completed",
      total: parseFloat(faker.commerce.price()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      params: {
        orderId: mockUpdatedOrder.id,
      },
      body: {
        user_id: mockUpdatedOrder.userId,
        status: mockUpdatedOrder.status,
        total: mockUpdatedOrder.total,
      },
    };

    mockUpdateOrderUseCase.execute.mockResolvedValue(mockUpdatedOrder);

    const result = await updateOrderController.execute(httpRequest);

    expect(mockUpdateOrderUseCase.execute).toHaveBeenCalledWith(
      mockUpdatedOrder.userId,
      mockUpdatedOrder.id,
      { status: mockUpdatedOrder.status, total: mockUpdatedOrder.total },
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockUpdatedOrder);
  });

  it("should return bad request when orderId is missing", async () => {
    const httpRequest = {
      params: {},
      body: {
        user_id: faker.string.uuid(),
        status: "completed",
        total: parseFloat(faker.commerce.price()),
      },
    };

    const result = await updateOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("O ID é obrigatório.");
  });

  it("should return bad request when userId is missing", async () => {
    const httpRequest = {
      params: {
        orderId: faker.string.uuid(),
      },
      body: {
        status: "completed",
        total: parseFloat(faker.commerce.price()),
      },
    };

    const result = await updateOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("ID do usuário não fornecido");
  });

  it("should return bad request for validation error", async () => {
    const httpRequest = {
      params: {
        orderId: faker.string.uuid(),
      },
      body: {
        user_id: faker.string.uuid(),
        status: "",
        total: -10,
      },
    };

    const result = await updateOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("message");
  });

  it("should return bad request for order not found or unauthorized", async () => {
    const httpRequest = {
      params: {
        orderId: faker.string.uuid(),
      },
      body: {
        user_id: faker.string.uuid(),
        status: "completed",
        total: parseFloat(faker.commerce.price()),
      },
    };

    mockUpdateOrderUseCase.execute.mockRejectedValue(
      new OrderNotFoundOrUnauthorizedError(
        "Pedido não encontrado ou não autorizado",
      ),
    );

    const result = await updateOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("Pedido não encontrado ou não autorizado");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        orderId: faker.string.uuid(),
      },
      body: {
        user_id: faker.string.uuid(),
        status: "completed",
        total: parseFloat(faker.commerce.price()),
      },
    };

    mockUpdateOrderUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await updateOrderController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
