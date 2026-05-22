import { AppShell } from "@/components/ats/app-shell";
import { requireAuth } from "@/lib/auth";

export default async function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAuth();

  return <AppShell>{children}</AppShell>;
}
