import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { type UserRole } from "@/lib/types";

export async function getSessionRole(): Promise<UserRole> {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as Record<string, unknown> | undefined;
  const metadata = claims?.metadata as Record<string, unknown> | undefined;
  const publicMetadata = claims?.publicMetadata as Record<string, unknown> | undefined;
  const role = (metadata?.role ?? publicMetadata?.role ?? "RECRUITER") as string;
  return role === "ADMIN" ? "ADMIN" : "RECRUITER";
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return userId;
}

export async function requireRole(role: UserRole) {
  const sessionRole = await getSessionRole();
  if (sessionRole !== role && role === "ADMIN") {
    redirect("/dashboard");
  }
  return sessionRole;
}
