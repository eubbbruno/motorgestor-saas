export function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as Record<string, unknown>).message;
    if (typeof message === "string") return message;
  }
  return null;
}

export function getHumanErrorMessage(error: unknown): string | null {
  const raw = getErrorMessage(error);
  if (!raw) return null;

  const msg = raw.toLowerCase();

  // Supabase Auth (mensagens comuns)
  if (msg.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (msg.includes("user already registered") || msg.includes("already registered")) {
    return "Este e-mail já está cadastrado. Faça login para continuar.";
  }
  if (msg.includes("email not confirmed")) {
    return "Seu e-mail ainda não foi confirmado. Verifique a caixa de entrada.";
  }
  if (msg.includes("jwt") && (msg.includes("expired") || msg.includes("invalid"))) {
    return "Sua sessão expirou. Faça login novamente.";
  }

  // RLS / Permissão
  if (msg.includes("row-level security") || msg.includes("violates row-level security policy")) {
    return "Sem permissão para concluir essa ação. Se for seu primeiro acesso, finalize o onboarding.";
  }

  return raw;
}

