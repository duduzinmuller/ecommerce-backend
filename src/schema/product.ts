import z from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome do produto é obrigatório",
  }),
  slug: z
    .string()
    .trim()
    .min(1, {
      message: "O slug é obrigatório.",
    })
    .transform((val) => val.toLowerCase().replace(/\s+/g, "-")),
  description: z.string().trim().min(30, {
    message: "A descrição deve ter pelo menos 30 caracteres",
  }),
  price: z
    .string()
    .min(1, "O preço é obrigatório")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "O preço deve ser um número decimal válido (ex: 10.50)",
    )
    .transform((val) => parseFloat(val)),
  stock: z
    .number()
    .int()
    .min(0, "O estoque deve ser um número inteiro não negativo"),
  category_id: z.string().trim().min(1, "A categoria é obrigatória"),
  image_url: z.string().url("A URL da imagem deve ser válida").optional(),
});

export const updateProductSchema = createProductSchema.partial().strict();
