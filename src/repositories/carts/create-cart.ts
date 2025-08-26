import { db } from "../../db";
import { carts } from "../../db/schema";
import { Cart } from "../../interfaces/cart";

export class CreateCartRepository {
  async execute(createCartParams: Cart) {
    const cart = await db
      .insert(carts)
      .values({
        id: createCartParams.id,
        user_id: createCartParams.user_id,
      })
      .returning();
    return cart;
  }
}
