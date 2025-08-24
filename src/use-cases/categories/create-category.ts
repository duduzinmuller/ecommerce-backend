import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { SlugAlreadyInCreateError } from "../../error/category";
import { CreateCategoryRepository } from "../../repositories/categories/create-category";
import { GetCategoryBySlugRepository } from "../../repositories/categories/get-category-by-slug";
import { Category } from "../../interfaces/category";

export class CreateCategoryUseCase {
  constructor(
    private idGeneratorAdapter: IdGeneratorAdapter,
    private createCategoryRepository: CreateCategoryRepository,
    private getCategoryBySlugRepository: GetCategoryBySlugRepository,
  ) {
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.createCategoryRepository = createCategoryRepository;
    this.getCategoryBySlugRepository = getCategoryBySlugRepository;
  }
  async execute(createCategoryParams: Category) {
    const withExistsSlug = await this.getCategoryBySlugRepository.execute(
      createCategoryParams.slug,
    );

    if (withExistsSlug) {
      throw new SlugAlreadyInCreateError(createCategoryParams.slug);
    }
    const categoryId = await this.idGeneratorAdapter.execute();

    const { id, ...restParams } = createCategoryParams;

    const category = {
      id: categoryId,
      ...restParams,
    };

    const createdCategory =
      await this.createCategoryRepository.execute(category);

    return createdCategory;
  }
}
