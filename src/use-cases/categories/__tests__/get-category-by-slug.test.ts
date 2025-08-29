import { faker } from "@faker-js/faker";
import { GetCategoryBySlugUseCase } from "../get-category-by-slug";
import { GetCategoryBySlugRepository } from "../../../repositories/categories/get-category-by-slug";

const mockGetCategoryBySlugRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetCategoryBySlugRepository>;

const getCategoryBySlugUseCase = new GetCategoryBySlugUseCase(
  mockGetCategoryBySlugRepository,
);

describe("GetCategoryBySlugUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get category by slug successfully", async () => {
    const mockCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const slug = mockCategory.slug;

    mockGetCategoryBySlugRepository.execute.mockResolvedValue(mockCategory);

    const result = await getCategoryBySlugUseCase.execute(slug);

    expect(mockGetCategoryBySlugRepository.execute).toHaveBeenCalledWith(slug);
    expect(result).toEqual(mockCategory);
  });

  it("should return null when category does not exist", async () => {
    const slug = faker.helpers.slugify(faker.commerce.department());

    mockGetCategoryBySlugRepository.execute.mockResolvedValue(null);

    const result = await getCategoryBySlugUseCase.execute(slug);

    expect(mockGetCategoryBySlugRepository.execute).toHaveBeenCalledWith(slug);
    expect(result).toBeNull();
  });
});
