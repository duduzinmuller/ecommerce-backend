import { faker } from "@faker-js/faker";
import { UpdateCartItemController } from "../update-cart-item";
import { UpdateCartItemUseCase } from "../../../use-cases/cart-items/update-cart-item";

const mockUpdateCartItemUseCase = {
  execute: jest.fn(),
} as jest.Mocked<UpdateCartItemUseCase>;

const updateCartItemController = new UpdateCartItemController(
  mockUpdateCartItemUseCase,
);

describe("UpdateCartItemController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a cart item successfully", async () => {
    const mockUpdatedCartItem = {
      id: faker.string.uuid(),
      cartId: faker.string.uuid(),
      productId: faker.string.uuid(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      params: {
        itemId: mockUpdatedCartItem.id,
      },
      body: {
        quantity: mockUpdatedCartItem.quantity,
      },
    };

    mockUpdateCartItemUseCase.execute.mockResolvedValue(mockUpdatedCartItem);

    const result = await updateCartItemController.execute(httpRequest);

    expect(mockUpdateCartItemUseCase.execute).toHaveBeenCalledWith(
      httpRequest.params.itemId,
      httpRequest.body.quantity,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockUpdatedCartItem);
  });

  it("should return bad request when itemId is missing", async () => {
    const httpRequest = {
      params: {},
      body: {
        quantity: faker.number.int({ min: 1, max: 10 }),
      },
    };

    const result = await updateCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("ID do item é obrigatório");
  });

  it("should return bad request for validation error", async () => {
    const httpRequest = {
      params: {
        itemId: faker.string.uuid(),
      },
      body: {
        quantity: 0,
      },
    };

    const result = await updateCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("message");
  });

  it("should return not found when cart item does not exist", async () => {
    const httpRequest = {
      params: {
        itemId: faker.string.uuid(),
      },
      body: {
        quantity: faker.number.int({ min: 1, max: 10 }),
      },
    };

    mockUpdateCartItemUseCase.execute.mockResolvedValue(null);

    const result = await updateCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("Item do carrinho não encontrado");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        itemId: faker.string.uuid(),
      },
      body: {
        quantity: faker.number.int({ min: 1, max: 10 }),
      },
    };

    mockUpdateCartItemUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await updateCartItemController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
