import { z } from "zod";

export const VehicleStatusSchema = z.enum([
  "disponivel",
  "reservado",
  "vendido",
  "inativo",
]);

export const VehicleFormSchema = z.object({
  title: z.string().min(3, "Informe um título (ex: Corolla XEi 2020)."),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  price: z.number().min(0).optional(),
  fipe_value: z.number().min(0).optional(),
  fipe_reference: z.string().optional(),
  fipe_code: z.string().optional(),
  mileage: z.number().int().min(0).optional(),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  color: z.string().optional(),
  status: VehicleStatusSchema,
  notes: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof VehicleFormSchema>;

