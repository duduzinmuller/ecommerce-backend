import { eq } from "drizzle-orm";
import { db } from "../../db";
import { products } from "../../db/schema";

export class GetProductByNameRepository {
  async execute(productName: string) {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.name, productName));
    const [product] = result;
    return product ?? null;
  }
}
