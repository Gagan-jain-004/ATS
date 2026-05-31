"use client";

import { useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SearchFilters({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const pathname = usePathname();

  const applyFilters = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of fd.entries()) {
      const v = String(value);
      if (v !== "" && v !== "all") {
        params.set(key, v);
      }
    }
    const query = params.toString();
    // Keep the current pathname (so we remain on the job dashboard), only change the query string
    router.replace(query ? `${pathname}?${query}` : `${pathname}`, { scroll: false });
  }, [router, pathname]);

  return (
    <form
      ref={formRef}
      className="grid gap-3 rounded-3xl border border-border bg-white p-4 lg:grid-cols-3"
      onSubmit={(e) => e.preventDefault()}
      onChange={() => void applyFilters()}
    >
      <Input name="name" defaultValue={String(searchParams.name ?? "")} placeholder="Search by name" />
      <Select name="status" defaultValue={String(searchParams.status ?? "all")} onValueChange={() => void applyFilters()}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="UNREAD">Unread</SelectItem>
          <SelectItem value="READ">Read</SelectItem>
          <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
          <SelectItem value="APPROVED">Approved</SelectItem>
          <SelectItem value="DECLINED">Declined</SelectItem>
        </SelectContent>
      </Select>
      <Select name="experience" defaultValue={String(searchParams.experience ?? "all")} onValueChange={() => void applyFilters()}>
        <SelectTrigger>
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Experience</SelectItem>
          <SelectItem value="0-3">0-3 Years</SelectItem>
          <SelectItem value="3-5">3-5 Years</SelectItem>
          <SelectItem value="5-8">5-8 Years</SelectItem>
          <SelectItem value="8+">8+ Years</SelectItem>
        </SelectContent>
      </Select>
    </form>
  );
}
