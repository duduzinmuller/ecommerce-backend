import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreateCategoryController } from "../controllers/categories/create-category";
import { CreateCategoryRepository } from "../repositories/categories/create-category";
import { GetCategoryBySlugRepository } from "../repositories/categories/get-category-by-slug";
import { CreateCategoryUseCase } from "../use-cases/categories/create-category";

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
