import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TalentStream AI | Internal ATS",
  description: "Internal recruiter ATS for fast resume filtering, semantic matching, and job management."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <html lang="en">
      <body className={inter.className}>{clerkKey ? <ClerkProvider publishableKey={clerkKey}>{children}</ClerkProvider> : children}</body>
    </html>
  );
}