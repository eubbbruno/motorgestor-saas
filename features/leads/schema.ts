import { z } from "zod";

export const LeadStatusSchema = z.enum([
  "novo",
  "contato",
  "visita",
  "proposta",
  "ganho",
  "perdido",
]);

export const LeadFormSchema = z.object({
  name: z.string().min(2, "Informe o nome do lead."),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  source: z.string().optional(),
  status: LeadStatusSchema,
  vehicle_id: z.string().uuid().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof LeadFormSchema>;

