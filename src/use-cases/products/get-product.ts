import { GetProductRepository } from "../../repositories/products/get-product";

export class GetProductUseCase {
  constructor(private getProductRepository: GetProductRepository) {
    this.getProductRepository = getProductRepository;
  }
  async execute() {
    const getProducts = await this.getProductRepository.execute();

    return getProducts;
  }
}
