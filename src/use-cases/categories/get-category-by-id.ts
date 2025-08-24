import { GetCategoryByIdRepository } from "../../repositories/categories/get-category-by-id";

export class GetCategoryByIdUseCase {
  constructor(private getCategoryByIdRepository: GetCategoryByIdRepository) {
    this.getCategoryByIdRepository = getCategoryByIdRepository;
  }
  async execute(categoryId: string) {
    const getCategoryById =
      await this.getCategoryByIdRepository.execute(categoryId);

    return getCategoryById;
  }
}
