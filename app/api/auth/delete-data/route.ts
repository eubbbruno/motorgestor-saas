import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/lib/supabase/service";

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function parseSignedRequest(signedRequest: string, appSecret: string): { user_id: string } | null {
  const parts = signedRequest.split(".");
  if (parts.length !== 2) return null;

  const [encodedSig, payload] = parts;

  const expectedSig = createHmac("sha256", appSecret)
    .update(payload)
    .digest("base64url");

  if (encodedSig !== expectedSig) return null;

  try {
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData().catch(() => null);
    const signedRequest = body?.get("signed_request") as string | null;

    if (!signedRequest) {
      return NextResponse.json({ error: "signed_request ausente." }, { status: 400 });
    }

    const appSecret = process.env.FACEBOOK_APP_SECRET;
    if (!appSecret) {
      return NextResponse.json({ error: "Configuração ausente." }, { status: 500 });
    }

    const parsed = parseSignedRequest(signedRequest, appSecret);
    if (!parsed?.user_id) {
      return NextResponse.json({ error: "signed_request inválido." }, { status: 400 });
    }

    const facebookUserId = parsed.user_id;
    const confirmationCode = `del_${facebookUserId}_${Date.now()}`;

    const db = createSupabaseServiceClient();
    if (db) {
      // Find Supabase user linked to this Facebook identity
      const { data: identities } = await db
        .from("identities" as never)
        .select("user_id")
        .eq("provider", "facebook")
        .eq("provider_id", facebookUserId)
        .single() as { data: { user_id: string } | null };

      if (identities?.user_id) {
        const userId = identities.user_id;

        // Delete user data in order (profiles first, then auth user)
        await db.from("profiles").delete().eq("id", userId);
        await db.auth.admin.deleteUser(userId);
      }
    }

    const statusUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.motorgestor.com.br"}/deletion-status?id=${confirmationCode}`;

    return NextResponse.json({ url: statusUrl, confirmation_code: confirmationCode });
  } catch (err) {
    console.error("[delete-data]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
