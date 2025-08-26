import { GetCategoryRepository } from "../../repositories/categories/get-category";

export class GetCategoryUseCase {
  constructor(private getCategoryRepository: GetCategoryRepository) {
    this.getCategoryRepository = getCategoryRepository;
  }
  async execute() {
    const getCategories = await this.getCategoryRepository.execute();

    return getCategories;
  }
}
