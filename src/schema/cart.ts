import z from "zod";

export const createCartSchema = z.object({
  user_id: z
    .string()
    .uuid({
      message: "O ID do usuario é obrigatorio.",
    })
    .trim(),
});
