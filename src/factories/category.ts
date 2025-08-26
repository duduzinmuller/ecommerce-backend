import { IdGeneratorAdapter } from "../adapters/id-generator";
import { CreateCategoryController } from "../controllers/categories/create-category";
import { DeleteCategoryController } from "../controllers/categories/delete-category";
import { GetCategoryController } from "../controllers/categories/get-category";
import { GetCategoryByIdController } from "../controllers/categories/get-category-by-id";
import { GetCategoryBySlugController } from "../controllers/categories/get-category-by-slug";
import { CreateCategoryRepository } from "../repositories/categories/create-category";
import { DeleteCategoryRepository } from "../repositories/categories/delete-category";
import { GetCategoryRepository } from "../repositories/categories/get-category";
import { GetCategoryByIdRepository } from "../repositories/categories/get-category-by-id";
import { GetCategoryBySlugRepository } from "../repositories/categories/get-category-by-slug";
import { CreateCategoryUseCase } from "../use-cases/categories/create-category";
import { DeleteCategoryUseCase } from "../use-cases/categories/delete-category";
import { GetCategoryUseCase } from "../use-cases/categories/get-category";
import { GetCategoryByIdUseCase } from "../use-cases/categories/get-category-by-id";
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

export const MakeGetCategoryController = () => {
  const getCategoryRepository = new GetCategoryRepository();
  const getCategoryUseCase = new GetCategoryUseCase(getCategoryRepository);
  const getCategoryController = new GetCategoryController(getCategoryUseCase);
  return getCategoryController;
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

export const MakeGetCategoryByIdController = () => {
  const getCategoryByIdRepository = new GetCategoryByIdRepository();
  const getCategoryByIdUseCase = new GetCategoryByIdUseCase(
    getCategoryByIdRepository,
  );
  const getCategoryByIdController = new GetCategoryByIdController(
    getCategoryByIdUseCase,
  );
  return getCategoryByIdController;
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
