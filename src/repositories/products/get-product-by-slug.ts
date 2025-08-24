import { eq } from "drizzle-orm";
import { db } from "../../db";
import { products } from "../../db/schema";

export class GetProductBySlugRepository {
  async execute(slug: string) {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));
    const [category] = result;
    return category ?? null;
  }
}
