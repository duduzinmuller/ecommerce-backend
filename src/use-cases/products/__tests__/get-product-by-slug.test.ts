import { faker } from "@faker-js/faker";
import { GetProductBySlugUseCase } from "../get-product-by-slug";
import { GetProductBySlugRepository } from "../../../repositories/products/get-product-by-slug";

const mockGetProductBySlugRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetProductBySlugRepository>;

const getProductBySlugUseCase = new GetProductBySlugUseCase(
  mockGetProductBySlugRepository,
);

describe("GetProductBySlugUseCase", () => {
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
      category_id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const slug = mockProduct.slug;

    mockGetProductBySlugRepository.execute.mockResolvedValue(
      mockProduct as any,
    );

    const result = await getProductBySlugUseCase.execute(slug);

    expect(mockGetProductBySlugRepository.execute).toHaveBeenCalledWith(slug);
    expect(result).toEqual(mockProduct);
  });

  it("should return null when product does not exist", async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());

    mockGetProductBySlugRepository.execute.mockRejectedValue(null);

    const result = await getProductBySlugUseCase.execute(slug);

    expect(mockGetProductBySlugRepository.execute).toHaveBeenCalledWith(slug);
    expect(result).toBeNull();
  });
});
