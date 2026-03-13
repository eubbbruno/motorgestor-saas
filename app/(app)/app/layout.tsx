import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";
import { MobileSidebar } from "@/components/app/mobile-sidebar";
import { GuidedOnboardingModal } from "@/components/app/guided-onboarding-modal";
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
    <div className="dark min-h-screen bg-[#05060a] text-white">
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
        <GuidedOnboardingModal />
        <main className="px-4 py-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

