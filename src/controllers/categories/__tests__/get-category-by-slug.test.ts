import { faker } from "@faker-js/faker";
import { GetCategoryBySlugController } from "../get-category-by-slug";
import { GetCategoryBySlugUseCase } from "../../../use-cases/categories/get-category-by-slug";

const mockGetCategoryBySlugUseCase = {
  execute: jest.fn(),
} as jest.Mocked<GetCategoryBySlugUseCase>;

const getCategoryBySlugController = new GetCategoryBySlugController(
  mockGetCategoryBySlugUseCase,
);

describe("GetCategoryBySlugController", () => {
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

    const httpRequest = {
      params: {
        slug: mockCategory.slug,
      },
    };

    mockGetCategoryBySlugUseCase.execute.mockResolvedValue(mockCategory);

    const result = await getCategoryBySlugController.execute(httpRequest);

    expect(mockGetCategoryBySlugUseCase.execute).toHaveBeenCalledWith(
      mockCategory.slug,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockCategory);
  });

  it("should return bad request when slug is missing", async () => {
    const httpRequest = {
      params: {},
    };

    const result = await getCategoryBySlugController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("Slug é obrigatório");
  });

  it("should return not found when category does not exist", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.department()),
      },
    };

    mockGetCategoryBySlugUseCase.execute.mockResolvedValue(null);

    const result = await getCategoryBySlugController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("Categoria não encontrada");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.department()),
      },
    };

    mockGetCategoryBySlugUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await getCategoryBySlugController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
