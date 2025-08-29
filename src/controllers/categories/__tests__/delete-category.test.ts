import { faker } from "@faker-js/faker";
import { DeleteCategoryController } from "../delete-category";
import { DeleteCategoryUseCase } from "../../../use-cases/categories/delete-category";

const mockDeleteCategoryUseCase = {
  execute: jest.fn(),
} as jest.Mocked<DeleteCategoryUseCase>;

const deleteCategoryController = new DeleteCategoryController(
  mockDeleteCategoryUseCase,
);

describe("DeleteCategoryController", () => {
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

    const httpRequest = {
      params: {
        slug: mockDeletedCategory.slug,
      },
    };

    mockDeleteCategoryUseCase.execute.mockResolvedValue(mockDeletedCategory);

    const result = await deleteCategoryController.execute(httpRequest);

    expect(mockDeleteCategoryUseCase.execute).toHaveBeenCalledWith(
      mockDeletedCategory.slug,
    );
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockDeletedCategory);
  });

  it("should return bad request when slug is missing", async () => {
    const httpRequest = {
      params: {},
    };

    const result = await deleteCategoryController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe("Slug é obrigatório");
  });

  it("should return not found when category does not exist", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.department()),
      },
    };

    mockDeleteCategoryUseCase.execute.mockResolvedValue(null);

    const result = await deleteCategoryController.execute(httpRequest);

    expect(result.statusCode).toBe(404);
    expect(result.body.message).toBe("Categoria não encontrada");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      params: {
        slug: faker.helpers.slugify(faker.commerce.department()),
      },
    };

    mockDeleteCategoryUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await deleteCategoryController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
