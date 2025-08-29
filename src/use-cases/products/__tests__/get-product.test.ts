import { faker } from "@faker-js/faker";
import { GetProductUseCase } from "../get-product";
import { GetProductRepository } from "../../../repositories/products/get-product";

const mockGetProductRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetProductRepository>;

const getProductUseCase = new GetProductUseCase(mockGetProductRepository);

describe("GetProductUseCase", () => {
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
        category_id: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        slug: faker.helpers.slugify(faker.commerce.productName()),
        category_id: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockGetProductRepository.execute.mockResolvedValue(mockProducts);

    const result = await getProductUseCase.execute();

    expect(mockGetProductRepository.execute).toHaveBeenCalled();
    expect(result).toEqual(mockProducts);
  });

  it("should return empty array when no products exist", async () => {
    mockGetProductRepository.execute.mockResolvedValue([]);

    const result = await getProductUseCase.execute();

    expect(mockGetProductRepository.execute).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
