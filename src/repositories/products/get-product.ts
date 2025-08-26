import { db } from "../../db";
import { products } from "../../db/schema";

export class GetProductRepository {
  async execute() {
    const allProducts = await db.select().from(products);

    return allProducts;
  }
}
