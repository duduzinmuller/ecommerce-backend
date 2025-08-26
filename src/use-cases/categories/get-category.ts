import { Category } from "../../interfaces/category";
import { GetCategoryRepository } from "../../repositories/categories/get-category";

export class GetCategoryUseCase {
  constructor(private getCategoryRepository: GetCategoryRepository) {
    this.getCategoryRepository = getCategoryRepository;
  }
  async execute(getCategories: Category) {
    const getCategory = await this.getCategoryRepository.execute(getCategories);

    return getCategory;
  }
}
