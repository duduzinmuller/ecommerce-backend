import { eq } from "drizzle-orm";
import { db } from "../../db";
import { cart_items, carts } from "../../db/schema";

export class ClearCartRepository {
  async execute(
    userId: string,
  ): Promise<typeof carts.$inferSelect | undefined> {
    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.user_id, userId));

    await db.delete(cart_items).where(eq(cart_items.cart_id, cart.id));

    return cart;
  }
}
