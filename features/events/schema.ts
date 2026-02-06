import { z } from "zod";

export const EventFormSchema = z.object({
  title: z.string().min(3, "Informe um título."),
  start_at: z.string().min(1, "Informe data/hora de início."),
  end_at: z.string().optional(),
  lead_id: z.string().uuid().optional().or(z.literal("")),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type EventFormValues = z.infer<typeof EventFormSchema>;

