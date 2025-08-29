import { faker } from "@faker-js/faker";
import { GetCategoryController } from "../get-category";
import { GetCategoryUseCase } from "../../../use-cases/categories/get-category";

const mockGetCategoryUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetCategoryUseCase>;

const getCategoryController = new GetCategoryController(mockGetCategoryUseCase);

describe("GetCategoryController", () => {
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

    const httpRequest = {};

    mockGetCategoryUseCase.execute.mockResolvedValue(mockCategories as any);

    const result = await getCategoryController.execute(httpRequest);

    expect(mockGetCategoryUseCase.execute).toHaveBeenCalled();
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockCategories);
  });

  it("should return empty array when no categories exist", async () => {
    const httpRequest = {};

    mockGetCategoryUseCase.execute.mockResolvedValue([]);

    const result = await getCategoryController.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual([]);
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {};

    mockGetCategoryUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await getCategoryController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
