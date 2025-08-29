import { faker } from "@faker-js/faker";
import { DeleteProductUseCase } from "../delete-product";
import { DeleteProductRepository } from "../../../repositories/products/delete-product";

const mockDeleteProductRepository = {
  execute: jest.fn(),
} as jest.Mocked<DeleteProductRepository>;

const deleteProductUseCase = new DeleteProductUseCase(
  mockDeleteProductRepository,
);

describe("DeleteProductUseCase", () => {
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
      category_id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const slug = mockDeletedProduct.slug;

    mockDeleteProductRepository.execute.mockResolvedValue(mockDeletedProduct);

    const result = await deleteProductUseCase.execute(slug);

    expect(mockDeleteProductRepository.execute).toHaveBeenCalledWith(slug);
    expect(result).toEqual(mockDeletedProduct);
  });

  it("should return null when product does not exist", async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());

    mockDeleteProductRepository.execute.mockResolvedValue(null);

    const result = await deleteProductUseCase.execute(slug);

    expect(mockDeleteProductRepository.execute).toHaveBeenCalledWith(slug);
    expect(result).toBeNull();
  });
});
