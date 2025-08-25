import { db } from "../../db";
import { products } from "../../db/schema";
import { Product } from "../../interfaces/product";

export class CreateProductRepository {
  async execute(createProductParams: Product) {
    const product = await db
      .insert(products)
      .values({
        id: createProductParams.id,
        name: createProductParams.name,
        slug: createProductParams.slug,
        price: createProductParams.price,
        stock: createProductParams.stock,
        description: createProductParams.description,
        category_id: createProductParams.category_id,
        image_url: createProductParams.image_url,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return product;
  }
}
