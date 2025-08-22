import { IdGeneratorAdapter } from "../../adapters/id-generator";
import { CreateCategoryRepository } from "../../repositories/categories/create-category";
import { Category } from "../../types/category";

export class CreateCategoryUseCase {
  constructor(
    private idGeneratorAdapter: IdGeneratorAdapter,
    private createCategoryRepository: CreateCategoryRepository,
  ) {
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.createCategoryRepository = createCategoryRepository;
  }
  async execute(createCategoryParams: Category) {
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
