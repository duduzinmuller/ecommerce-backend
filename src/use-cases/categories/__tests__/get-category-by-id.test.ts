import { faker } from "@faker-js/faker";
import { GetCategoryByIdUseCase } from "../get-category-by-id";
import { GetCategoryByIdRepository } from "../../../repositories/categories/get-category-by-id";

const mockGetCategoryByIdRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetCategoryByIdRepository>;

const getCategoryByIdUseCase = new GetCategoryByIdUseCase(
  mockGetCategoryByIdRepository,
);

describe("GetCategoryByIdUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get category by id successfully", async () => {
    const mockCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const categoryId = mockCategory.id;

    mockGetCategoryByIdRepository.execute.mockResolvedValue(mockCategory);

    const result = await getCategoryByIdUseCase.execute(categoryId);

    expect(mockGetCategoryByIdRepository.execute).toHaveBeenCalledWith(
      categoryId,
    );
    expect(result).toEqual(mockCategory);
  });

  it("should return null when category does not exist", async () => {
    const categoryId = faker.string.uuid();

    mockGetCategoryByIdRepository.execute.mockRejectedValue(
      new Error("Category not found"),
    );

    const result = await getCategoryByIdUseCase.execute(categoryId);

    expect(mockGetCategoryByIdRepository.execute).toHaveBeenCalledWith(
      categoryId,
    );
    expect(result).toBeNull();
  });
});
