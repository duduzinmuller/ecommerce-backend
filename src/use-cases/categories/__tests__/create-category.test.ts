import { faker } from "@faker-js/faker";
import { CreateCategoryUseCase } from "../create-category";
import { IdGeneratorAdapter } from "../../../adapters/id-generator";
import { CreateCategoryRepository } from "../../../repositories/categories/create-category";
import { GetCategoryBySlugRepository } from "../../../repositories/categories/get-category-by-slug";
import { SlugAlreadyInCreateError } from "../../../error/category";

const mockIdGeneratorAdapter = {
  execute: jest.fn(),
} as jest.Mocked<IdGeneratorAdapter>;

const mockCreateCategoryRepository = {
  execute: jest.fn(),
} as jest.Mocked<CreateCategoryRepository>;

const mockGetCategoryBySlugRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetCategoryBySlugRepository>;

const createCategoryUseCase = new CreateCategoryUseCase(
  mockIdGeneratorAdapter,
  mockCreateCategoryRepository,
  mockGetCategoryBySlugRepository,
);

describe("CreateCategoryUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a category successfully", async () => {
    const mockCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
    };

    mockGetCategoryBySlugRepository.execute.mockResolvedValue(null);
    mockIdGeneratorAdapter.execute.mockResolvedValue(mockCategory.id);
    mockCreateCategoryRepository.execute.mockResolvedValue({
      ...mockCategory,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createCategoryUseCase.execute(mockCategory);

    expect(mockGetCategoryBySlugRepository.execute).toHaveBeenCalledWith(
      mockCategory.slug,
    );
    expect(mockIdGeneratorAdapter.execute).toHaveBeenCalled();
    expect(mockCreateCategoryRepository.execute).toHaveBeenCalledWith({
      id: mockCategory.id,
      name: mockCategory.name,
      slug: mockCategory.slug,
    });
    expect(result).toHaveProperty("id", mockCategory.id);
  });

  it("should throw SlugAlreadyInCreateError when slug already exists", async () => {
    const mockCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
    };

    const existingCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: mockCategory.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetCategoryBySlugRepository.execute.mockResolvedValue(existingCategory);

    await expect(createCategoryUseCase.execute(mockCategory)).rejects.toThrow(
      SlugAlreadyInCreateError,
    );

    expect(mockGetCategoryBySlugRepository.execute).toHaveBeenCalledWith(
      mockCategory.slug,
    );
    expect(mockCreateCategoryRepository.execute).not.toHaveBeenCalled();
  });
});
