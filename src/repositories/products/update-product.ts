import { db } from "../../db";
import { products } from "../../db/schema";
import { UpdateProductParams } from "../../interfaces/product";
import { eq } from "drizzle-orm";

export class UpdateProductRepository {
  async execute(slug: string, updateProductParams: UpdateProductParams) {
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (existingProduct.length === 0) {
      throw new Error("Produto não encontrado");
    }

    const updatedProduct = await db
      .update(products)
      .set({
        ...updateProductParams,
        updated_at: new Date(),
      })
      .where(eq(products.slug, slug))
      .returning();

    return updatedProduct[0];
  }
}
