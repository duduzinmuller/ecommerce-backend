import { z } from "zod";

export const createCartItemSchema = z.object({
  cart_id: z.string().uuid("ID do carrinho deve ser um UUID válido"),
  product_id: z.string().uuid("ID do produto deve ser um UUID válido"),
  quantity: z
    .number()
    .int()
    .positive("Quantidade deve ser um número inteiro positivo"),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int()
    .min(0, "Quantidade deve ser um número inteiro não negativo"),
});

export const cartItemParamsSchema = z.object({
  cartId: z.string().uuid("ID do carrinho deve ser um UUID válido"),
  itemId: z.string().uuid("ID do item deve ser um UUID válido"),
});
