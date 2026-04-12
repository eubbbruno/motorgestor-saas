import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getTrialInfo(companyId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("company_id", companyId)
    .in("status", ["active", "trial"])
    .maybeSingle();

  if (subscription?.status === "active") return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("trial_ends_at")
    .eq("company_id", companyId)
    .maybeSingle();

  if (!profile?.trial_ends_at) return null;

  const trialEnd = new Date(profile.trial_ends_at);
  const now = new Date();
  const daysLeft = Math.ceil(
    (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft <= 0) return null;

  return { daysLeft };
}

export async function TrialBanner({ companyId }: { companyId: string }) {
  const trial = await getTrialInfo(companyId);
  if (!trial) return null;

  return (
    <div className="flex items-center justify-center gap-3 bg-amber-400 px-4 py-2 text-sm font-medium text-amber-950">
      <AlertTriangleIcon className="size-4 shrink-0" />
      <span>
        Período de teste —{" "}
        <strong>
          {trial.daysLeft} {trial.daysLeft === 1 ? "dia restante" : "dias restantes"}
        </strong>
        .
      </span>
      <Link
        href="/app/billing"
        className="underline underline-offset-2 hover:opacity-80"
      >
        Assinar agora →
      </Link>
    </div>
  );
}
