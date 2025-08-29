import { faker } from "@faker-js/faker";
import { CreateCategoryController } from "../create-category";
import { CreateCategoryUseCase } from "../../../use-cases/categories/create-category";
import { SlugAlreadyInCreateError } from "../../../error/category";

const mockCreateCategoryUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<CreateCategoryUseCase>;

const createCategoryController = new CreateCategoryController(
  mockCreateCategoryUseCase,
);

describe("CreateCategoryController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a category successfully", async () => {
    const mockCategory = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      slug: faker.helpers.slugify(faker.commerce.department()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const httpRequest = {
      body: {
        name: mockCategory.name,
        slug: mockCategory.slug,
      },
    };

    mockCreateCategoryUseCase.execute.mockResolvedValue(mockCategory as any);

    const result = await createCategoryController.execute(httpRequest);

    expect(mockCreateCategoryUseCase.execute).toHaveBeenCalledWith(
      httpRequest.body,
    );
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(mockCategory);
  });

  it("should return bad request for validation error", async () => {
    const httpRequest = {
      body: {
        name: "",
        slug: "",
      },
    };

    const result = await createCategoryController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toHaveProperty("message");
  });

  it("should return bad request for slug already in use", async () => {
    const httpRequest = {
      body: {
        name: faker.commerce.department(),
        slug: faker.helpers.slugify(faker.commerce.department()),
      },
    };

    mockCreateCategoryUseCase.execute.mockRejectedValue(
      new SlugAlreadyInCreateError("Slug já está em uso"),
    );

    const result = await createCategoryController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe("Slug já está em uso");
  });

  it("should return server error for unexpected error", async () => {
    const httpRequest = {
      body: {
        name: faker.commerce.department(),
        slug: faker.helpers.slugify(faker.commerce.department()),
      },
    };

    mockCreateCategoryUseCase.execute.mockRejectedValue(
      new Error("Database error"),
    );

    const result = await createCategoryController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
