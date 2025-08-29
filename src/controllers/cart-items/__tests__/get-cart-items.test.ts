import { faker } from "@faker-js/faker";
import { GetCartItemsController } from "../get-cart-items";
import { GetCartItemsUseCase } from "../../../use-cases/cart-items/get-cart-items";

const mockGetCartItemsUseCase = {
  execute: jest.fn(),
} as jest.Mocked<GetCartItemsUseCase>;

const getCartItemsController = new GetCartItemsController(
  mockGetCartItemsUseCase,
);

describe("GetCartItemsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get cart items successfully", async () => {
    const mockCartItems = [
      {
        id: faker.string.uuid(),
        cartId: faker.string.uuid(),
        productId: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: faker.string.uuid(),
        cartId: faker.string.uuid(),
        productId: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const httpRequest = {
      params: {
        cartId: faker.string.uuid(),
      },
    };

    mockGetCartItemsUseCase.execute.mockResolvedValue(mockCartItems);

    const result = await getCartItemsController.execute(httpRequest);

    expect(mockGetCartItemsUseCase.execute).toHaveBeenCalledWith(
      httpRequest.params.cartId,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockCartItems);
  });

  it("should return bad request when cartId is missing", async () => {
    const httpRequest = {
      params: {},
    };

    const result = await getCartItemsController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("ID do carrinho é obrigatório");
  });

  it("should return empty array when no cart items exist", async () => {
    const httpRequest = {
      params: {
        cartId: faker.string.uuid(),
      },
    };

    mockGetCartItemsUseCase.execute.mockResolvedValue([]);

    const result = await getCartItemsController.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual([]);
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        cartId: faker.string.uuid(),
      },
    };

    mockGetCartItemsUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await getCartItemsController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
