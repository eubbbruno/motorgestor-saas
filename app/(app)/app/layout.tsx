import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";
import { MobileSidebar } from "@/components/app/mobile-sidebar";
import { getUserAndProfile } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getUserAndProfile();

  if (!user) redirect("/login");

  const roleLabel =
    profile?.role === "admin" ? "Admin" : profile?.role === "vendedor" ? "Vendedor" : "";

  return (
    <div className="min-h-screen bg-[radial-gradient(900px_circle_at_0%_0%,rgba(16,185,129,.10),transparent_55%),radial-gradient(900px_circle_at_100%_10%,rgba(59,130,246,.10),transparent_55%)]">
      <div className="flex min-h-screen">
        <AppSidebar />
        <MobileSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar
            name={profile?.full_name ?? user.email}
            email={profile?.email ?? user.email}
            roleLabel={roleLabel}
          />
          <div className="flex-1 px-4 py-8 lg:px-8 lg:py-10">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

