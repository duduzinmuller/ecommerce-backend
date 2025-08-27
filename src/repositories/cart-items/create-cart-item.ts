import { eq, and } from "drizzle-orm";
import { db } from "../../db";
import { cart_items, products } from "../../db/schema";
import {
  CreateCartItemRequest,
  CartItemWithProduct,
} from "../../interfaces/cart-item";
export class CreateCartItemRepository {
  async execute(data: CreateCartItemRequest): Promise<CartItemWithProduct> {
    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        image_url: products.image_url,
      })
      .from(products)
      .where(eq(products.id, data.product_id));

    const [existingItem] = await db
      .select()
      .from(cart_items)
      .where(
        and(
          eq(cart_items.cart_id, data.cart_id),
          eq(cart_items.product_id, data.product_id),
        ),
      );

    if (existingItem) {
      const [updatedItem] = await db
        .update(cart_items)
        .set({ quantity: existingItem.quantity + data.quantity })
        .where(eq(cart_items.id, existingItem.id))
        .returning();

      return {
        ...updatedItem,
        product,
      };
    }

    const [newItem] = await db
      .insert(cart_items)
      .values({
        id: data.id,
        cart_id: data.cart_id,
        product_id: data.product_id,
        quantity: data.quantity,
      })
      .returning();

    return {
      ...newItem,
      product,
    };
  }
}
