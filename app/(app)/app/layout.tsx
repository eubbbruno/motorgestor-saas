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
    <div className="dark min-h-screen bg-[#0D1A0F] text-foreground">
      <AppSidebar />
      <MobileSidebar />

      <div className="min-h-screen lg:pl-80">
        <div className="sticky top-0 z-40">
          <AppTopbar
            name={profile?.full_name ?? user.email}
            email={profile?.email ?? user.email}
            roleLabel={roleLabel}
          />
        </div>
        <main className="px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

