import { faker } from "@faker-js/faker";
import { GetProductController } from "../get-product";
import { GetProductUseCase } from "../../../use-cases/products/get-product";

const mockGetProductUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetProductUseCase>;

const getProductController = new GetProductController(mockGetProductUseCase);

describe("GetProductController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get all products successfully", async () => {
    const mockProducts = [
      {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        slug: faker.helpers.slugify(faker.commerce.productName()),
        categoryId: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        slug: faker.helpers.slugify(faker.commerce.productName()),
        categoryId: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const httpRequest = {};

    mockGetProductUseCase.execute.mockResolvedValue(mockProducts as any);

    const result = await getProductController.execute(httpRequest);

    expect(mockGetProductUseCase.execute).toHaveBeenCalled();
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockProducts);
  });

  it("should return empty array when no products exist", async () => {
    const httpRequest = {};

    mockGetProductUseCase.execute.mockResolvedValue([]);

    const result = await getProductController.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual([]);
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {};

    mockGetProductUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await getProductController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
