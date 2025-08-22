import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome da categoria é obrigatório.",
  }),
  slug: z
    .string()
    .trim()
    .min(1, {
      message: "O slug é obrigatório.",
    })
    .transform((val) => val.toLowerCase().replace(/\s+/g, "-")),
});
