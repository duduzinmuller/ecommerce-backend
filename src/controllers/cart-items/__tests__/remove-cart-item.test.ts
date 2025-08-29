import { faker } from "@faker-js/faker";
import { RemoveCartItemController } from "../remove-cart-item";
import { RemoveCartItemUseCase } from "../../../use-cases/cart-items/remove-cart-item";

const mockRemoveCartItemUseCase = {
  execute: jest.fn(),
} as jest.Mocked<RemoveCartItemUseCase>;

const removeCartItemController = new RemoveCartItemController(
  mockRemoveCartItemUseCase,
);

describe("RemoveCartItemController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should remove a cart item successfully", async () => {
    const mockRemovedCartItem = {
      id: faker.string.uuid(),
      cartId: faker.string.uuid(),
      productId: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      params: {
        itemId: mockRemovedCartItem.id,
      },
    };

    mockRemoveCartItemUseCase.execute.mockResolvedValue(mockRemovedCartItem);

    const result = await removeCartItemController.execute(httpRequest);

    expect(mockRemoveCartItemUseCase.execute).toHaveBeenCalledWith(
      mockRemovedCartItem.id,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockRemovedCartItem);
  });

  it("should return bad request when itemId is missing", async () => {
    const httpRequest = {
      params: {},
    };

    const result = await removeCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("ID do item é obrigatório");
  });

  it("should return not found when cart item does not exist", async () => {
    const httpRequest = {
      params: {
        itemId: faker.string.uuid(),
      },
    };

    mockRemoveCartItemUseCase.execute.mockResolvedValue(null);

    const result = await removeCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("Cart Item não encontrado");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        itemId: faker.string.uuid(),
      },
    };

    mockRemoveCartItemUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await removeCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
