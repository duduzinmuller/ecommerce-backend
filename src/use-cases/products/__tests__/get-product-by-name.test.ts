import { faker } from "@faker-js/faker";
import { GetProductByNameUseCase } from "../get-product-by-name";
import { GetProductByNameRepository } from "../../../repositories/products/get-product-by-name";

const mockGetProductByNameRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetProductByNameRepository>;

const getProductByNameUseCase = new GetProductByNameUseCase(
  mockGetProductByNameRepository,
);

describe("GetProductByNameUseCase", () => {
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
      category_id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const productName = mockProduct.name;

    mockGetProductByNameRepository.execute.mockResolvedValue(mockProduct);

    const result = await getProductByNameUseCase.execute(productName);

    expect(mockGetProductByNameRepository.execute).toHaveBeenCalledWith(
      productName,
    );
    expect(result).toEqual(mockProduct);
  });

  it("should return null when product does not exist", async () => {
    const productName = faker.commerce.productName();

    mockGetProductByNameRepository.execute.mockResolvedValue(null);

    const result = await getProductByNameUseCase.execute(productName);

    expect(mockGetProductByNameRepository.execute).toHaveBeenCalledWith(
      productName,
    );
    expect(result).toBeNull();
  });
});
