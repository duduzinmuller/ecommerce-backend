import { z } from "zod";
import { isValidBrazilianDocument } from "../utils/document";
import { UFStates } from "../utils/state";

export const createOrderSchema = z.object({
  delivery_street: z.string().min(1, "Rua é obrigatória"),
  delivery_number: z.string().min(1, "Número é obrigatório"),
  delivery_neighborhood: z.string().min(1, "Bairro é obrigatório"),
  delivery_complement: z.string().optional(),
  delivery_city: z.string().min(1, "Cidade é obrigatória"),
  delivery_state: z
    .string()
    .length(2, "Estado deve ter 2 caracteres")
    .refine((value) => UFStates.includes(value as any), {
      message: "Estado inválido",
    }),
  delivery_zip_code: z.string().min(1, "CEP é obrigatório"),
  document: z
    .string()
    .min(11, "Documento inválido")
    .max(18, "Documento inválido")
    .refine((value) => isValidBrazilianDocument(value), {
      message: "Documento inválido",
    }),
});

export const updateOrderSchema = createOrderSchema.partial().strict();
