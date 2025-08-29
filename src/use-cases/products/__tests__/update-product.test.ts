import { faker } from "@faker-js/faker";
import { UpdateProductUseCase } from "../update-product";
import { GetProductBySlugRepository } from "../../../repositories/products/get-product-by-slug";
import { GetCategoryByIdRepository } from "../../../repositories/categories/get-category-by-id";
import { UpdateProductRepository } from "../../../repositories/products/update-product";
import {
  CategoryIsNotFound,
  SlugAlreadyInCreateError,
} from "../../../error/category";

const mockGetProductBySlugRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetProductBySlugRepository>;

const mockGetCategoryByIdRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetCategoryByIdRepository>;

const mockUpdateProductRepository = {
  execute: jest.fn(),
} as jest.Mocked<UpdateProductRepository>;

const updateProductUseCase = new UpdateProductUseCase(
  mockGetProductBySlugRepository,
  mockGetCategoryByIdRepository,
  mockUpdateProductRepository,
);

describe("UpdateProductUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a product successfully", async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());
    const updateParams = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category_id: faker.string.uuid(),
    };

    const mockUpdatedProduct = {
      id: faker.string.uuid(),
      ...updateParams,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUpdateProductRepository.execute.mockResolvedValue(mockUpdatedProduct);

    const result = await updateProductUseCase.execute(slug, updateParams);

    expect(mockUpdateProductRepository.execute).toHaveBeenCalledWith(
      slug,
      updateParams,
    );
    expect(result).toEqual(mockUpdatedProduct);
  });

  it("should throw SlugAlreadyInCreateError when new slug already exists", async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());
    const updateParams = {
      slug: faker.helpers.slugify(faker.commerce.productName()),
    };

    const existingProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      slug: updateParams.slug,
      category_id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetProductBySlugRepository.execute.mockResolvedValue(existingProduct);

    await expect(
      updateProductUseCase.execute(slug, updateParams),
    ).rejects.toThrow(SlugAlreadyInCreateError);

    expect(mockGetProductBySlugRepository.execute).toHaveBeenCalledWith(
      updateParams.slug,
    );
    expect(mockUpdateProductRepository.execute).not.toHaveBeenCalled();
  });

  it("should not throw error when slug is the same", async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());
    const updateParams = {
      slug,
    };

    const existingProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      slug,
      category_id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockUpdatedProduct = {
      ...existingProduct,
      name: faker.commerce.productName(),
    };

    mockGetProductBySlugRepository.execute.mockResolvedValue(existingProduct);
    mockUpdateProductRepository.execute.mockResolvedValue(mockUpdatedProduct);

    const result = await updateProductUseCase.execute(slug, updateParams);

    expect(mockGetProductBySlugRepository.execute).toHaveBeenCalledWith(
      updateParams.slug,
    );
    expect(mockUpdateProductRepository.execute).toHaveBeenCalledWith(
      slug,
      updateParams,
    );
    expect(result).toEqual(mockUpdatedProduct);
  });

  it("should throw CategoryIsNotFound when category does not exist", async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());
    const updateParams = {
      category_id: faker.string.uuid(),
    };

    mockGetCategoryByIdRepository.execute.mockResolvedValue(null);

    await expect(
      updateProductUseCase.execute(slug, updateParams),
    ).rejects.toThrow(CategoryIsNotFound);

    expect(mockGetCategoryByIdRepository.execute).toHaveBeenCalledWith(
      updateParams.category_id,
    );
    expect(mockUpdateProductRepository.execute).not.toHaveBeenCalled();
  });

  it("should update product when category exists", async () => {
    const slug = faker.helpers.slugify(faker.commerce.productName());
    const updateParams = {
      category_id: faker.string.uuid(),
    };

    const mockCategory = {
      id: updateParams.category_id,
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockUpdatedProduct = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      slug,
      category_id: updateParams.category_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetCategoryByIdRepository.execute.mockResolvedValue(mockCategory);
    mockUpdateProductRepository.execute.mockResolvedValue(mockUpdatedProduct);

    const result = await updateProductUseCase.execute(slug, updateParams);

    expect(mockGetCategoryByIdRepository.execute).toHaveBeenCalledWith(
      updateParams.category_id,
    );
    expect(mockUpdateProductRepository.execute).toHaveBeenCalledWith(
      slug,
      updateParams,
    );
    expect(result).toEqual(mockUpdatedProduct);
  });
});
