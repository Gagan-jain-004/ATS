"use client";

import React from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

type HomeAuthActionsProps = {
  variant?: "header" | "cta";
};

export function HomeAuthActions({ variant = "header" }: HomeAuthActionsProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();
  const signOut = clerk?.signOut?.bind(clerk);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const profileImage = user?.imageUrl ?? null;
  const initials = ((user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") || "A").toUpperCase();

  if (!isLoaded) {
    return variant === "header" ? <div className="h-11 w-11" aria-hidden="true" /> : <div className="h-11 w-28" aria-hidden="true" />;
  }

  if (isSignedIn && user) {
    if (variant === "header") {
      return (
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white p-0 focus:outline-none"
          >
            {profileImage ? (
              <img src={profileImage} alt={user.fullName ?? "Profile"} className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#2563eb)] text-xs font-bold text-white">
                {initials}
              </span>
            )}
          </button>

          {menuOpen ? (
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border bg-white py-1 shadow-lg">
              <Link href="/account" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                Account
              </Link>
              <button
                type="button"
                onClick={async () => {
                  setMenuOpen(false);
                  try {
                    if (signOut) await signOut();
                  } catch (error) {
                    console.error(error);
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <Button asChild size="lg" variant="outline" className="rounded-xl border-slate-300 bg-white/90">
        <Link href="/account">Open profile</Link>
      </Button>
    );
  }

  if (variant === "header") {
    return (
      <Button asChild variant="outline" className="rounded-xl">
        <Link href="/sign-in">Sign in</Link>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" variant="outline" className="rounded-xl border-slate-300 bg-white/90">
      <Link href="/sign-in">Clerk sign in</Link>
    </Button>
  );
}