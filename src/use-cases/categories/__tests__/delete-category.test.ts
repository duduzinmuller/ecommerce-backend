import { faker } from "@faker-js/faker";
import { DeleteCategoryUseCase } from "../delete-category";
import { DeleteCategoryRepository } from "../../../repositories/categories/delete-category";

const mockDeleteCategoryRepository = {
  execute: jest.fn(),
} as jest.Mocked<DeleteCategoryRepository>;

const deleteCategoryUseCase = new DeleteCategoryUseCase(
  mockDeleteCategoryRepository,
);

describe("DeleteCategoryUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a category successfully", async () => {
    const mockDeletedCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const slug = mockDeletedCategory.slug;

    mockDeleteCategoryRepository.execute.mockResolvedValue(mockDeletedCategory);

    const result = await deleteCategoryUseCase.execute(slug);

    expect(mockDeleteCategoryRepository.execute).toHaveBeenCalledWith(slug);
    expect(result).toEqual(mockDeletedCategory);
  });

  it("should return null when category does not exist", async () => {
    const slug = faker.helpers.slugify(faker.commerce.department());

    mockDeleteCategoryRepository.execute.mockResolvedValue(null);

    const result = await deleteCategoryUseCase.execute(slug);

    expect(mockDeleteCategoryRepository.execute).toHaveBeenCalledWith(slug);
    expect(result).toBeNull();
  });
});
