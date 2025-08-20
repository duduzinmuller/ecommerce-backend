import z from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome e obrigatório.",
  }),
  email: z
    .string()
    .trim()
    .email({
      message: "O email e invalído",
    })
    .min(1, {
      message: "O email e obrigatório",
    }),
  password: z.string().trim().min(8, {
    message: "A senha deve ter no miníno 8 caracteres.",
  }),
});
