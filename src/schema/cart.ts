import z from "zod";

export const createCartSchema = z.object({
  user_id: z.string().trim().min(1, "O usuario é obrigatorio"),
});
