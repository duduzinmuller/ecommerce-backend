import { z } from "zod";

export const createOrderSchema = z.object({
  user_id: z.string().min(1, "ID do usuário é obrigatório"),
  status: z.enum(["pending", "completed", "cancelled"]).default("pending"),
  total: z.number().min(0, "O total deve ser positivo"),
  delivery_street: z.string().min(1, "Rua é obrigatória"),
  delivery_number: z.string().min(1, "Número é obrigatório"),
  delivery_neighborhood: z.string().min(1, "Bairro é obrigatório"),
  delivery_complement: z.string().optional(),
  delivery_city: z.string().min(1, "Cidade é obrigatória"),
  delivery_state: z.string().length(2, "Estado deve ter 2 caracteres"),
  delivery_zip_code: z.string().min(1, "CEP é obrigatório"),
  document: z
    .string()
    .min(11, "Documento inválido")
    .max(18, "Documento inválido"),
});
