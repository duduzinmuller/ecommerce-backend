import { DeleteCategoryRepository } from "../../repositories/categories/delete-category";

export class DeleteCategoryUseCase {
  constructor(private deleteCategoryRepository: DeleteCategoryRepository) {
    this.deleteCategoryRepository = deleteCategoryRepository;
  }
  async execute(slug: string) {
    const deletedCategory = await this.deleteCategoryRepository.execute(slug);

    return deletedCategory;
  }
}
