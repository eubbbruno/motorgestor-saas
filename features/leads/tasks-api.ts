"use client";

export type LeadTaskStatus = "pending" | "done" | "cancelled";

export type LeadTaskRow = {
  id: string;
  lead_id: string;
  company_id: string;
  title: string;
  description: string | null;
  status: LeadTaskStatus;
  due_date: string | null; // YYYY-MM-DD
  created_by: string | null;
  created_at: string;
};

export async function listLeadTasks(leadId: string): Promise<LeadTaskRow[]> {
  const res = await fetch(`/api/leads/${leadId}/tasks`, { method: "GET" });
  const json = (await res.json().catch(() => null)) as
    | { ok: true; tasks: LeadTaskRow[] }
    | { ok: false; error: string };
  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao carregar tarefas.");
  }
  return json.tasks ?? [];
}

export async function createLeadTask(args: {
  leadId: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
}): Promise<LeadTaskRow> {
  const res = await fetch(`/api/leads/${args.leadId}/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      title: args.title,
      description: args.description ?? null,
      due_date: args.due_date ?? null,
    }),
  });
  const json = (await res.json().catch(() => null)) as
    | { ok: true; task: LeadTaskRow }
    | { ok: false; error: string };
  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao criar tarefa.");
  }
  return json.task;
}

export async function patchTask(args: {
  taskId: string;
  status?: LeadTaskStatus;
}): Promise<LeadTaskRow> {
  const res = await fetch(`/api/tasks/${args.taskId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: args.status }),
  });
  const json = (await res.json().catch(() => null)) as
    | { ok: true; task: LeadTaskRow }
    | { ok: false; error: string };
  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao atualizar tarefa.");
  }
  return json.task;
}

export async function deleteTask(taskId: string): Promise<void> {
  const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
  const json = (await res.json().catch(() => null)) as
    | { ok: true }
    | { ok: false; error: string };
  if (!res.ok || !json || json.ok === false) {
    throw new Error(json && "error" in json ? json.error : "Falha ao excluir tarefa.");
  }
}

