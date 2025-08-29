import { faker } from "@faker-js/faker";
import { GetProductByNameController } from "../get-product-by-name";
import { GetProductByNameUseCase } from "../../../use-cases/products/get-product-by-name";

const mockGetProductByNameUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetProductByNameUseCase>;

const getProductByNameController = new GetProductByNameController(
  mockGetProductByNameUseCase,
);

describe("GetProductByNameController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get product by name successfully", async () => {
    const mockProduct = {
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
      query: {
        productName: mockProduct.name,
      },
    };

    mockGetProductByNameUseCase.execute.mockResolvedValue(mockProduct as any);

    const result = await getProductByNameController.execute(httpRequest);

    expect(mockGetProductByNameUseCase.execute).toHaveBeenCalledWith(
      mockProduct.name,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockProduct);
  });

  it("should return bad request when productName is missing", async () => {
    const httpRequest = {
      query: {},
    };

    const result = await getProductByNameController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("O nome do produto é obrigatório.");
  });

  it("should return not found when product does not exist", async () => {
    const httpRequest = {
      query: {
        productName: faker.commerce.productName(),
      },
    };

    mockGetProductByNameUseCase.execute.mockRejectedValue(
      new Error("Product not found"),
    );

    const result = await getProductByNameController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body).toBe("Produto não encontrado");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      query: {
        productName: faker.commerce.productName(),
      },
    };

    mockGetProductByNameUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await getProductByNameController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
