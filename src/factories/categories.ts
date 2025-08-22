import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreateCategoryController } from "../controllers/categories/create-category";
import { DeleteCategoryController } from "../controllers/categories/delete-category";
import { GetCategoryBySlugController } from "../controllers/categories/get-category-by-slug";
import { CreateCategoryRepository } from "../repositories/categories/create-category";
import { DeleteCategoryRepository } from "../repositories/categories/delete-category";
import { GetCategoryBySlugRepository } from "../repositories/categories/get-category-by-slug";
import { CreateCategoryUseCase } from "../use-cases/categories/create-category";
import { DeleteCategoryUseCase } from "../use-cases/categories/delete-category";
import { GetCategoryBySlugUseCase } from "../use-cases/categories/get-category-by-slug";

export const MakeCreateCategoryController = () => {
  const createCategoryRepository = new CreateCategoryRepository();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const getCategoryBySlugRepository = new GetCategoryBySlugRepository();
  const createCategoryUseCase = new CreateCategoryUseCase(
    idGeneratorAdapter,
    createCategoryRepository,
    getCategoryBySlugRepository,
  );
  const createCategoryController = new CreateCategoryController(
    createCategoryUseCase,
  );
  return createCategoryController;
};

export const MakeGetCategoryBySlugController = () => {
  const getCategoryBySlugRepository = new GetCategoryBySlugRepository();
  const getCategoryBySlugUseCase = new GetCategoryBySlugUseCase(
    getCategoryBySlugRepository,
  );
  const getCategoryBySlugController = new GetCategoryBySlugController(
    getCategoryBySlugUseCase,
  );
  return getCategoryBySlugController;
};

export const MakeDeleteCategoryController = () => {
  const deleteCategoryRepository = new DeleteCategoryRepository();
  const deleteCategoryUseCase = new DeleteCategoryUseCase(
    deleteCategoryRepository,
  );
  const deleteCategoryController = new DeleteCategoryController(
    deleteCategoryUseCase,
  );
  return deleteCategoryController;
};
