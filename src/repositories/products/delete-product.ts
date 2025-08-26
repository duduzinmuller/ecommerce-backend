import { eq } from "drizzle-orm";
import { db } from "../../db";
import { products } from "../../db/schema";

export class DeleteProductRepository {
  async execute(slug: string) {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));

    await db.delete(products).where(eq(products.slug, slug));

    return product[0];
  }
}
