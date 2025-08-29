import { faker } from "@faker-js/faker";
import { GetProductBySlugController } from "../get-product-by-slug";
import { GetProductBySlugUseCase } from "../../../use-cases/products/get-product-by-slug";

const mockGetProductBySlugUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetProductBySlugUseCase>;

const getProductBySlugController = new GetProductBySlugController(
  mockGetProductBySlugUseCase,
);

describe("GetProductBySlugController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get product by slug successfully", async () => {
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
      params: {
        slug: mockProduct.slug,
      },
    };

    mockGetProductBySlugUseCase.execute.mockResolvedValue(mockProduct as any);

    const result = await getProductBySlugController.execute(httpRequest);

    expect(mockGetProductBySlugUseCase.execute).toHaveBeenCalledWith(
      mockProduct.slug,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockProduct);
  });

  it("should return bad request when slug is missing", async () => {
    const httpRequest = {
      params: {},
    };

    const result = await getProductBySlugController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("Slug é obrigatório");
  });

  it("should return not found when product does not exist", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.productName()),
      },
    };

    mockGetProductBySlugUseCase.execute.mockRejectedValue(
      new Error("Product not found"),
    );

    const result = await getProductBySlugController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body).toBe("Produto não encontrado");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.productName()),
      },
    };

    mockGetProductBySlugUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await getProductBySlugController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
