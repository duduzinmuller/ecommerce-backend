import { faker } from "@faker-js/faker";
import { GetCategoryUseCase } from "../get-category";
import { GetCategoryRepository } from "../../../repositories/categories/get-category";

const mockGetCategoryRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetCategoryRepository>;

const getCategoryUseCase = new GetCategoryUseCase(mockGetCategoryRepository);

describe("GetCategoryUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get all categories successfully", async () => {
    const mockCategories = [
      {
        id: faker.string.uuid(),
        name: faker.commerce.department(),
        slug: faker.helpers.slugify(faker.commerce.department()),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: faker.string.uuid(),
        name: faker.commerce.department(),
        slug: faker.helpers.slugify(faker.commerce.department()),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockGetCategoryRepository.execute.mockResolvedValue(mockCategories);

    const result = await getCategoryUseCase.execute();

    expect(mockGetCategoryRepository.execute).toHaveBeenCalled();
    expect(result).toEqual(mockCategories);
  });

  it("should return empty array when no categories exist", async () => {
    mockGetCategoryRepository.execute.mockResolvedValue([]);

    const result = await getCategoryUseCase.execute();

    expect(mockGetCategoryRepository.execute).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
