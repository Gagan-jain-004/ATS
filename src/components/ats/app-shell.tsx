"use client";

import React from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import MatchExplainDialog from "@/components/ats/match-explain-dialog";



export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();
  const signOut = clerk?.signOut?.bind(clerk);
  const initials = isLoaded && user ? ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase() : "ME";
  const [menuOpen, setMenuOpen] = React.useState(false);
  const typedUser = user as unknown as { profileImageUrl?: string; imageUrl?: string };
  const profileImage = isLoaded && user ? (typedUser.profileImageUrl ?? typedUser.imageUrl ?? null) : null;

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-950">
            TalentStream AI
          </Link>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <MatchExplainDialog />
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Recruiter Mode</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Internal ATS</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              className="flex items-center rounded-full focus:outline-none"
            >
              {isLoaded && isSignedIn && user ? (
                profileImage ? (
                  <img src={profileImage} alt={user.fullName ?? "Profile"} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#0f172a,#2563eb)] p-[1px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">{initials}</div>
                  </div>
                )
              ) : (
                <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#0f172a,#2563eb)] p-[1px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">{initials}</div>
                </div>
              )}
            </button>

            {menuOpen ? (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border bg-white py-1 shadow-lg">
                <Link href="/account" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Account</Link>
                <button
                  onClick={async () => {
                    setMenuOpen(false);
                    try { if (signOut) await signOut(); } catch (e) { console.error(e); }
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1600px]">
        <main className="min-w-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(248,250,252,0.85))] p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
