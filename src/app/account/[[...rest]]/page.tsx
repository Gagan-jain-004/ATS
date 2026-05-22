"use client";

import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold">Account</h2>
      <div className="max-w-3xl">
        <UserProfile routing="hash" />
      </div>
    </div>
  );
}
