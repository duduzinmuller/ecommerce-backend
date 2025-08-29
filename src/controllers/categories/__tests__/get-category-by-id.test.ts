import { faker } from "@faker-js/faker";
import { GetCategoryByIdController } from "../get-category-by-id";
import { GetCategoryByIdUseCase } from "../../../use-cases/categories/get-category-by-id";

const mockGetCategoryByIdUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetCategoryByIdUseCase>;

const getCategoryByIdController = new GetCategoryByIdController(
  mockGetCategoryByIdUseCase,
);

describe("GetCategoryByIdController", () => {
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

    const httpRequest = {
      params: {
        categoryId: mockCategory.id,
      },
    };

    mockGetCategoryByIdUseCase.execute.mockResolvedValue(mockCategory);

    const result = await getCategoryByIdController.execute(httpRequest);

    expect(mockGetCategoryByIdUseCase.execute).toHaveBeenCalledWith(
      mockCategory.id,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockCategory);
  });

  it("should return bad request when categoryId is missing", async () => {
    const httpRequest = {
      params: {},
    };

    const result = await getCategoryByIdController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("Este ID é invalído.");
  });

  it("should return not found when category does not exist", async () => {
    const httpRequest = {
      params: {
        categoryId: faker.string.uuid(),
      },
    };

    mockGetCategoryByIdUseCase.execute.mockRejectedValue(
      new Error("Category not found"),
    );

    const result = await getCategoryByIdController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body).toBe("Categoria não encontrada.");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        categoryId: faker.string.uuid(),
      },
    };

    mockGetCategoryByIdUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await getCategoryByIdController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
