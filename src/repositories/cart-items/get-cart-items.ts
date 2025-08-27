import { eq } from "drizzle-orm";
import { db } from "../../db";
import { cart_items, products } from "../../db/schema";
import { CartItemWithProduct } from "../../interfaces/cart-item";

export class GetCartItemsRepository {
  async execute(cartId: string) {
    const items = await db
      .select({
        id: cart_items.id,
        cart_id: cart_items.cart_id,
        product_id: cart_items.product_id,
        quantity: cart_items.quantity,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          image_url: products.image_url,
        },
      })
      .from(cart_items)
      .innerJoin(products, eq(cart_items.product_id, products.id))
      .where(eq(cart_items.cart_id, cartId));

    return items;
  }
}
