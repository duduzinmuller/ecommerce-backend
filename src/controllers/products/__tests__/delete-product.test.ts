import { faker } from "@faker-js/faker";
import { DeleteProductController } from "../delete-product";
import { DeleteProductUseCase } from "../../../use-cases/products/delete-product";

const mockDeleteProductUseCase = {
  execute: jest.fn(),
} as jest.Mocked<DeleteProductUseCase>;

const deleteProductController = new DeleteProductController(
  mockDeleteProductUseCase,
);

describe("DeleteProductController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a product successfully", async () => {
    const mockDeletedProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      slug: faker.helpers.slugify(faker.commerce.productName()),
      categoryId: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      params: {
        slug: mockDeletedProduct.slug,
      },
    };

    mockDeleteProductUseCase.execute.mockResolvedValue(mockDeletedProduct);

    const result = await deleteProductController.execute(httpRequest);

    expect(mockDeleteProductUseCase.execute).toHaveBeenCalledWith(
      mockDeletedProduct.slug,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockDeletedProduct);
  });

  it("should return bad request when slug is missing", async () => {
    const httpRequest = {
      params: {},
    };

    const result = await deleteProductController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("Slug é obrigatório");
  });

  it("should return not found when product does not exist", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.productName()),
      },
    };

    mockDeleteProductUseCase.execute.mockResolvedValue(null);

    const result = await deleteProductController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("Produto não encontrado.");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.productName()),
      },
    };

    mockDeleteProductUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await deleteProductController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
