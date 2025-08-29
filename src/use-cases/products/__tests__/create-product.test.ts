import { faker } from "@faker-js/faker";
import { CreateProductUseCase } from "../create-product";
import { CreateProductRepository } from "../../../repositories/products/create-product";
import { GetProductBySlugRepository } from "../../../repositories/products/get-product-by-slug";
import { IdGeneratorAdapter } from "../../../adapters/id-generator";
import { GetCategoryByIdRepository } from "../../../repositories/categories/get-category-by-id";
import {
  CategoryIsNotFound,
  SlugAlreadyInCreateError,
} from "../../../error/category";

const mockCreateProductRepository = {
  execute: jest.fn(),
} as jest.Mocked<CreateProductRepository>;

const mockGetProductBySlugRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetProductBySlugRepository>;

const mockIdGeneratorAdapter = {
  execute: jest.fn(),
} as jest.Mocked<IdGeneratorAdapter>;

const mockGetCategoryByIdRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetCategoryByIdRepository>;

const createProductUseCase = new CreateProductUseCase(
  mockCreateProductRepository,
  mockGetProductBySlugRepository,
  mockIdGeneratorAdapter,
  mockGetCategoryByIdRepository,
);

describe("CreateProductUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a product successfully", async () => {
    const mockProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      slug: faker.helpers.slugify(faker.commerce.productName()),
      category_id: faker.string.uuid(),
    };

    const mockCategory = {
      id: mockProduct.category_id,
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetProductBySlugRepository.execute.mockResolvedValue(null);
    mockIdGeneratorAdapter.execute.mockResolvedValue(mockProduct.id);
    mockGetCategoryByIdRepository.execute.mockResolvedValue(mockCategory);
    mockCreateProductRepository.execute.mockResolvedValue({
      ...mockProduct,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createProductUseCase.execute(mockProduct);

    expect(mockGetProductBySlugRepository.execute).toHaveBeenCalledWith(
      mockProduct.slug,
    );
    expect(mockIdGeneratorAdapter.execute).toHaveBeenCalled();
    expect(mockGetCategoryByIdRepository.execute).toHaveBeenCalledWith(
      mockProduct.category_id,
    );
    expect(mockCreateProductRepository.execute).toHaveBeenCalledWith({
      id: mockProduct.id,
      name: mockProduct.name,
      description: mockProduct.description,
      price: mockProduct.price,
      slug: mockProduct.slug,
      category_id: mockProduct.category_id,
    });
    expect(result).toHaveProperty("id", mockProduct.id);
  });

  it("should throw SlugAlreadyInCreateError when slug already exists", async () => {
    const mockProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      slug: faker.helpers.slugify(faker.commerce.productName()),
      category_id: faker.string.uuid(),
    };

    const existingProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      slug: mockProduct.slug,
      category_id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetProductBySlugRepository.execute.mockResolvedValue(existingProduct);

    await expect(createProductUseCase.execute(mockProduct)).rejects.toThrow(
      SlugAlreadyInCreateError,
    );

    expect(mockGetProductBySlugRepository.execute).toHaveBeenCalledWith(
      mockProduct.slug,
    );
    expect(mockCreateProductRepository.execute).not.toHaveBeenCalled();
  });

  it("should throw CategoryIsNotFound when category does not exist", async () => {
    const mockProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      slug: faker.helpers.slugify(faker.commerce.productName()),
      category_id: faker.string.uuid(),
    };

    mockGetProductBySlugRepository.execute.mockResolvedValue(null);
    mockIdGeneratorAdapter.execute.mockResolvedValue(mockProduct.id);
    mockGetCategoryByIdRepository.execute.mockResolvedValue(null);

    await expect(createProductUseCase.execute(mockProduct)).rejects.toThrow(
      CategoryIsNotFound,
    );

    expect(mockGetProductBySlugRepository.execute).toHaveBeenCalledWith(
      mockProduct.slug,
    );
    expect(mockIdGeneratorAdapter.execute).toHaveBeenCalled();
    expect(mockGetCategoryByIdRepository.execute).toHaveBeenCalledWith(
      mockProduct.category_id,
    );
    expect(mockCreateProductRepository.execute).not.toHaveBeenCalled();
  });
});
