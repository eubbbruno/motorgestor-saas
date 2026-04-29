import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const token: string = (body.token ?? "").trim();
  const phoneNumberId: string = (body.phone_number_id ?? "").trim();

  if (!token || !phoneNumberId) {
    return NextResponse.json(
      { connected: false, error: "Token e Phone Number ID são obrigatórios." },
      { status: 400 },
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    let res: Response;
    try {
      res = await fetch(
        `https://graph.facebook.com/v18.0/${encodeURIComponent(phoneNumberId)}?fields=display_phone_number,verified_name,status`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        },
      );
    } finally {
      clearTimeout(timeout);
    }

    const data = (await res.json()) as {
      display_phone_number?: string;
      verified_name?: string;
      status?: string;
      error?: { message?: string; code?: number };
    };

    if (!res.ok || data.error) {
      return NextResponse.json({
        connected: false,
        error: data.error?.message ?? `HTTP ${res.status}`,
      });
    }

    return NextResponse.json({
      connected: true,
      display_name: data.verified_name ?? data.display_phone_number ?? "—",
      phone: data.display_phone_number ?? "—",
      status: data.status ?? "active",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro de rede.";
    return NextResponse.json({ connected: false, error: message }, { status: 502 });
  }
}
