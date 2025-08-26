import { DeleteProductRepository } from "../../repositories/products/delete-product";

export class DeleteProductUseCase {
  constructor(private deleteProductRepository: DeleteProductRepository) {
    this.deleteProductRepository = deleteProductRepository;
  }
  async execute(slug: string) {
    const deletedProduct = await this.deleteProductRepository.execute(slug);

    return deletedProduct;
  }
}
