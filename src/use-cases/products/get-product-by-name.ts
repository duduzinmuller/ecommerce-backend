import { GetProductByNameRepository } from "../../repositories/products/get-product-by-name";

export class GetProductByNameUseCase {
  constructor(private getProductByNameRepository: GetProductByNameRepository) {
    this.getProductByNameRepository = getProductByNameRepository;
  }
  async execute(productName: string) {
    const getProductByName =
      await this.getProductByNameRepository.execute(productName);

    return getProductByName;
  }
}
