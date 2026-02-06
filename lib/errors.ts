export function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as Record<string, unknown>).message;
    if (typeof message === "string") return message;
  }
  return null;
}

