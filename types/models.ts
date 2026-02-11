export type UserRole = "admin" | "vendedor";

export type VehicleStatus = "disponivel" | "reservado" | "vendido" | "inativo";

export type LeadStatus = "novo" | "contato" | "visita" | "proposta" | "ganho" | "perdido";

export type ProfileRow = {
  id: string;
  company_id: string | null;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

export type CompanyRow = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type VehicleRow = {
  id: string;
  company_id: string;
  created_by: string | null;
  title: string;
  make: string | null;
  model: string | null;
  year: number | null;
  price: number | null;
  fipe_value?: number | null;
  fipe_reference?: string | null;
  fipe_code?: string | null;
  mileage: number | null;
  fuel: string | null;
  transmission: string | null;
  color: string | null;
  status: VehicleStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadRow = {
  id: string;
  company_id: string;
  created_by: string | null;
  vehicle_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  status: LeadStatus;
  last_contact_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  company_id: string;
  created_by: string | null;
  lead_id: string | null;
  title: string;
  start_at: string;
  end_at: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

