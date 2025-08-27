import { eq } from "drizzle-orm";
import { db } from "../../db";
import { cart_items, products } from "../../db/schema";

export class UpdateCartItemRepository {
  async execute(itemId: string, quantity: number) {
    const [existingItem] = await db
      .select()
      .from(cart_items)
      .where(eq(cart_items.id, itemId));

    if (!existingItem) {
      return null;
    }

    if (quantity <= 0) {
      await db.delete(cart_items).where(eq(cart_items.id, itemId));
      return null;
    }

    const [updatedItem] = await db
      .update(cart_items)
      .set({ quantity })
      .where(eq(cart_items.id, itemId))
      .returning();

    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        image_url: products.image_url,
      })
      .from(products)
      .where(eq(products.id, updatedItem.product_id));

    return {
      ...updatedItem,
      product,
    };
  }
}
