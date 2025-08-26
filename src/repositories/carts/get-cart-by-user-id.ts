import { eq } from "drizzle-orm";
import { db } from "../../db";
import { cart_items, carts, products } from "../../db/schema";

export class GetCartByUserIdRepository {
  async execute(userId: string) {
    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.user_id, userId));

    if (!cart) {
      return null;
    }

    const items = await db
      .select({
        itemId: cart_items.id,
        quantity: cart_items.quantity,
        productId: products.id,
        name: products.name,
        price: products.price,
        imageUrl: products.image_url,
      })
      .from(cart_items)
      .innerJoin(products, eq(cart_items.product_id, products.id))
      .where(eq(cart_items.cart_id, cart.id));

    return { ...cart, items };
  }
}
